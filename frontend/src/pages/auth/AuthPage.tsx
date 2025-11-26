import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, User2, ArrowRight, Camera, Sparkles, Building2 } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { authService } from '../../services/authService'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../store/authStore'

type AuthMode = 'login' | 'signup' | 'forgot'

interface AuthPageProps {
  mode: AuthMode
}

type SignupValues = {
  name: string
  email: string
  password: string
  userType: 'influencer' | 'brand'
  bio?: string
  categories?: string
  socialHandle?: string
  companyName?: string
  website?: string
}

type LoginValues = {
  email: string
  password: string
}

type ForgotValues = {
  email: string
}

const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const signupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  userType: yup.mixed<'influencer' | 'brand'>().oneOf(['influencer', 'brand']).required(),
  bio: yup
    .string()
    .when('userType', {
      is: 'influencer',
      then: (schema) => schema.required('Tell us about yourself'),
      otherwise: (schema) => schema,
    }),
  categories: yup.string().when('userType', {
    is: 'influencer',
    then: (schema) => schema.required('Share your niches'),
    otherwise: (schema) => schema,
  }),
  socialHandle: yup.string().when('userType', {
    is: 'influencer',
    then: (schema) => schema.required('Share a primary handle'),
    otherwise: (schema) => schema,
  }),
  companyName: yup.string().when('userType', {
    is: 'brand',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema,
  }),
  website: yup.string().when('userType', {
    is: 'brand',
    then: (schema) => schema.required('Company website is required'),
    otherwise: (schema) => schema,
  }),
}) as yup.ObjectSchema<SignupValues>

const forgotSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
})

const heroScores = [
  { label: 'Campaigns launched', value: '5,240+' },
  { label: 'Avg. approval time', value: '47m' },
  { label: 'Creator earnings', value: '$2.1M' },
]

const benefitList = [
  'AI profile audit & optimization',
  'Concierge onboarding for brands',
  'Secure escrow payouts & invoices',
  'Predictive analytics & brief templates',
]

export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate()
  // setUserType is used later together with authStore.setAuth
  const [loading, setLoading] = useState(false)
  const [signupStep, setSignupStep] = useState(1)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const loginForm = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const signupForm = useForm<SignupValues>({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      userType: 'influencer',
      bio: '',
      categories: '',
      socialHandle: '',
      companyName: '',
      website: '',
    },
  })
  const forgotForm = useForm<ForgotValues>({
    resolver: yupResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const userType = signupForm.watch('userType')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const url = URL.createObjectURL(acceptedFiles[0])
        setProfilePreview(url)
      }
    },
  })

  const handleGoogleAuth = () => {
    const pendingType = mode === 'signup' ? signupForm.getValues('userType') : 'influencer'
    localStorage.setItem('pendingUserType', pendingType)
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const redirectAfterLogin = (userRole?: string) => {
    if (userRole === 'influencer') {
      navigate('/influencer/dashboard')
    } else if (userRole === 'brand') {
      navigate('/brand/dashboard')
    } else {
      navigate('/')
    }
  }
  const { setUserType } = useAppStore()
  const { setAuth } = useAuthStore()

  

  const handleAuthError = (err: unknown, fallbackMessage = 'An error occurred. Please try again.') => {
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as any).response
      if (response?.status === 409 && response.data?.promptLogin) {
        toast.error('This email is already registered. Please log in.')
        navigate('/login')
        return
      }
      if (response?.status === 403 && response.data?.requiresVerification && response.data?.userId) {
        toast.success('Please verify the code we emailed you.')
        const searchParams = new URLSearchParams({
          userId: String(response.data.userId),
          email: response.data.email || '',
          requiresPassword: String(response.data.requiresPassword !== false),
        })
        navigate(`/verify-otp?${searchParams.toString()}`)
        return
      }
      const message = response?.data?.message ?? fallbackMessage
      toast.error(message)
      return
    }
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error(fallbackMessage)
    }
  }

  // Login handler — single canonical implementation. It supports
  // OTP verification flows, stores the token, updates app state and auth store,
  // and redirects to the right dashboard.
  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    setLoading(true)
    try {
      const result = await authService.login(values)

      // If backend indicates OTP / email verification is required, redirect.
      if (result?.requiresVerification && result?.userId) {
        toast.success('Check your inbox for a verification code.')
        const searchParams = new URLSearchParams({
          userId: String(result.userId),
          email: result.email || values.email,
          requiresPassword: String(result.requiresPassword !== false),
        })
        navigate(`/verify-otp?${searchParams.toString()}`)
        return
      }

      // Successful login — normalize user object and persist token
      if (result?.token && result?.user) {
        // keep quick local/state sync for UI
        setUserType(result.user.userType)

        // store authenticated user + token in auth store
        setAuth(
          {
            id: result.user.id || result.user._id,
            _id: result.user.id || result.user._id,
            name: result.user.name || values.email.split('@')[0],
            email: result.user.email || values.email,
            userType: result.user.userType,
          },
          result.token
        )

        // keep the legacy localStorage token for API interceptor compatibility
        localStorage.setItem('token', result.token)
        localStorage.setItem('userType', result.user.userType)

        toast.success('Welcome back ✨')
        redirectAfterLogin(result.user.userType)
        return
      }

      toast.error('Login failed. Please try again.')
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  })

  const handleSignupSubmit = async () => {
    const fieldsByStep: Record<number, (keyof SignupValues)[]> = {
      1: ['userType'],
      2: ['name', 'email', 'password'],
      3:
        userType === 'influencer'
          ? ['bio', 'categories', 'socialHandle']
          : ['companyName', 'website'],
    }

    const valid = await signupForm.trigger(fieldsByStep[signupStep])
    if (!valid) return

    if (signupStep < 3) {
      setSignupStep((prev) => prev + 1)
      return
    }
        
    setLoading(true)
    try {
      const values = signupForm.getValues()
      
      // Build payload with all required fields
      const payload: any = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        userType: values.userType,
      }

      // Add influencer-specific fields
      if (values.userType === 'influencer') {
        if (values.bio) payload.bio = values.bio.trim()
        if (values.categories) payload.categories = values.categories.trim()
        if (values.socialHandle) payload.socialHandle = values.socialHandle.trim()
      }

      // Add brand-specific fields
      if (values.userType === 'brand') {
        if (values.companyName) payload.companyName = values.companyName.trim()
        if (values.website) payload.website = values.website.trim()
      }

      console.log('Sending registration payload:', payload)
      
      const result = await authService.register(payload)

      // If backend asks for OTP verification, redirect to VerifyOTP
      if (result?.requiresVerification && result?.userId) {
        toast.success('Check your inbox for the verification code.')
        setUserType(values.userType)
        localStorage.setItem('userType', values.userType)
        const searchParams = new URLSearchParams({
          userId: result.userId,
          email: result.email || values.email,
          requiresPassword: 'true',
        })
        navigate(`/verify-otp?${searchParams.toString()}`)
        return
      }
      // Some backends will return a token + user here (no verification required)
      if (result?.token && result?.user) {
        setUserType(result.user.userType)

        setAuth(
          {
            id: result.user.id || result.user._id,
            _id: result.user.id || result.user._id,
            name: result.user.name || values.email.split('@')[0],
            email: result.user.email || values.email,
            userType: result.user.userType,
          },
          result.token
        )
        toast.success('Welcome ✨')
        redirectAfterLogin(result.user.userType)
        return
      }

      toast.error('Unexpected response. Please try again.')
    } catch (error) {
      console.error('Registration error:', error)
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = forgotForm.handleSubmit(async (values) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('If an account exists, you will receive a reset link shortly.')
      console.info('Forgot password requested for', values.email)
    } finally {
      setLoading(false)
    }
  })

  const stepLabel = useMemo(() => {
    if (signupStep === 1) return 'Select your account'
    if (signupStep === 2) return 'Basic information'
    return 'Complete your profile'
  }, [signupStep])

  const renderError = (message?: string) =>
    message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null

  const renderLoginForm = () => (
    <form className="space-y-5" onSubmit={handleLoginSubmit}>
      <div>
        <label className="text-sm text-charcoal/70">Email</label>
        <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
          <Mail size={18} className="text-charcoal/40" />
          <input
            type="email"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
            placeholder="you@email.com"
            {...loginForm.register('email')}
          />
        </div>
        {renderError(loginForm.formState.errors.email?.message)}
      </div>

      <div>
        <label className="text-sm text-charcoal/70">Password</label>
        <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
          <Lock size={18} className="text-charcoal/40" />
          <input
            type="password"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
            placeholder="••••••••"
            {...loginForm.register('password')}
          />
        </div>
        {renderError(loginForm.formState.errors.password?.message)}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-charcoal/70">
          <input type="checkbox" defaultChecked className="rounded border-charcoal/20 text-sage focus:ring-sage" />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-sage hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <Button type="button" variant="secondary" fullWidth onClick={handleGoogleAuth}>
        Continue with Google
      </Button>
    </form>
  )

  const renderSignupForm = () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal/40">
          Step {signupStep} / 3
        </p>
        <h2 className="mt-2 font-display text-3xl text-charcoal">{stepLabel}</h2>
      </div>

      {signupStep === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "I'm an Influencer", value: 'influencer', description: 'Share your work, land premium briefs.' },
            { label: "I'm a Brand", value: 'brand', description: 'Book curated talent and track ROI.' },
          ].map((card) => (
            <button
              type="button"
              key={card.value}
              onClick={() => signupForm.setValue('userType', card.value as 'influencer' | 'brand')}
              className={cn(
                'rounded-[28px] border p-6 text-left transition',
                signupForm.getValues('userType') === card.value
                  ? 'border-sage bg-sage/10 shadow-card'
                  : 'border-charcoal/10 hover:border-charcoal/30'
              )}
            >
              <div className="flex items-center gap-3">
                {card.value === 'influencer' ? <Sparkles /> : <Building2 />}
                <div>
                  <p className="font-semibold text-charcoal">{card.label}</p>
                  <p className="text-sm text-charcoal/60">{card.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {signupStep === 2 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm text-charcoal/70">Full name</label>
            <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
              <User2 size={18} className="text-charcoal/40" />
              <input 
                className="h-12 flex-1 bg-transparent text-sm outline-none"
                placeholder="Amelia Hart"
                {...signupForm.register('name')}
              />
            </div>
            {renderError(signupForm.formState.errors.name?.message)}
          </div>

          <div>
            <label className="text-sm text-charcoal/70">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
              <Mail size={18} className="text-charcoal/40" />
              <input 
                type="email" 
                className="h-12 flex-1 bg-transparent text-sm outline-none"
                placeholder="studio@lumicollab.com"
                {...signupForm.register('email')}
              />
            </div>
            {renderError(signupForm.formState.errors.email?.message)}
          </div>

          <div>
            <label className="text-sm text-charcoal/70">Password</label>
            <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
              <Lock size={18} className="text-charcoal/40" />
              <input 
                type="password" 
                className="h-12 flex-1 bg-transparent text-sm outline-none"
                placeholder="Minimum 6 characters"
                {...signupForm.register('password')}
              />
            </div>
            {renderError(signupForm.formState.errors.password?.message)}
          </div>
        </div>
      )}

      {signupStep === 3 && (
        <div className="space-y-5">
          {userType === 'influencer' ? (
            <>
              <div>
                <label className="text-sm text-charcoal/70">Bio</label>
                <textarea
                  className="mt-2 w-full rounded-[24px] border border-charcoal/10 bg-white p-4 text-sm"
                  rows={3}
                  placeholder="Share your tone, audience, and dream partnerships."
                  {...signupForm.register('bio')}
                />
                {renderError(signupForm.formState.errors.bio?.message)}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-charcoal/70">Primary handle</label>
                  <input
                    className="mt-2 w-full rounded-3xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
                    placeholder="@lux.travels"
                    {...signupForm.register('socialHandle')}
                  />
                  {renderError(signupForm.formState.errors.socialHandle?.message)}
                </div>
                <div>
                  <label className="text-sm text-charcoal/70">Categories</label>
                  <input
                    className="mt-2 w-full rounded-3xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
                    placeholder="Luxury, wellness, travel"
                    {...signupForm.register('categories')}
                  />
                  {renderError(signupForm.formState.errors.categories?.message)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-charcoal/70">Company name</label>
                <input
                  className="mt-2 w-full rounded-3xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
                  placeholder="Paragon Studios"
                  {...signupForm.register('companyName')}
                />
                {renderError(signupForm.formState.errors.companyName?.message)}
              </div>
              <div>
                <label className="text-sm text-charcoal/70">Website</label>
                <input
                  className="mt-2 w-full rounded-3xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
                  placeholder="https://"
                  {...signupForm.register('website')}
                />
                {renderError(signupForm.formState.errors.website?.message)}
              </div>
            </>
          )}

          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-6 text-center transition',
              isDragActive ? 'border-sage bg-sage/10' : 'border-charcoal/20 bg-white/60'
            )}
          >
            <input {...getInputProps()} />
            <Camera className="text-charcoal/40" />
            <p className="mt-2 text-sm text-charcoal/70">
              Drag & drop a profile image or click to upload.
            </p>
            {profilePreview && (
              <img src={profilePreview} alt="Profile preview" className="mt-4 h-20 w-20 rounded-3xl object-cover" />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-charcoal/60">Need help? Our concierge team replies in under 5 minutes.</p>
        <Button onClick={handleSignupSubmit} disabled={loading} rightIcon={<ArrowRight size={18} />}>
          {signupStep < 3 ? 'Continue' : loading ? 'Creating account...' : 'Complete profile'}
        </Button>
      </div>
    </div>
  )

  const renderForgotForm = () => (
    <form className="space-y-5" onSubmit={handleForgotSubmit}>
      <div>
        <label className="text-sm text-charcoal/70">Email</label>
        <div className="mt-2 flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-4">
          <Mail size={18} className="text-charcoal/40" />
          <input
            type="email"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
            placeholder="you@email.com"
            {...forgotForm.register('email')}
          />
        </div>
        {renderError(forgotForm.formState.errors.email?.message)}
      </div>
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Sending link…' : 'Send reset link'}
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-cream/70">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-charcoal/95 px-10 py-12 text-white lg:flex">
          <div className="space-y-6">
            <Badge tone="cream">LumiCollab</Badge>
            <h1 className="font-display text-4xl leading-tight">
              A private studio for iconic creators & refined brands.
            </h1>
            <p className="text-white/70">
              Concierge onboarding, AI copilots, and glass dashboards keep every collaboration effortless. Join the roster trusted by Prada, Peloton, and Supreme.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {benefitList.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 rounded-[32px] bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Platform pulse</p>
            <div className="grid gap-4 md:grid-cols-3">
              {heroScores.map((score) => (
                <div key={score.label}>
                  <p className="text-2xl font-semibold text-white">{score.value}</p>
                  <p className="text-xs text-white/60">{score.label}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className="absolute inset-0 -z-10 opacity-50"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <div className="noise-overlay" />
          </motion.div>
        </section>

        <section className="flex items-center justify-center px-6 py-16 lg:px-12">
          <div className="w-full max-w-lg rounded-[40px] border border-white/70 bg-white/90 p-10 shadow-card backdrop-blur">
            <div className="space-y-2">
              <Badge tone="charcoal">
                {mode === 'login' && 'Welcome back'}
                {mode === 'signup' && 'Create your studio access'}
                {mode === 'forgot' && 'Reset password'}
              </Badge>
              <h2 className="font-display text-4xl text-charcoal">
                {mode === 'login' && 'Sign in to your studio'}
                {mode === 'signup' && 'Lets refine your profile'}
                {mode === 'forgot' && 'We will help you get back in'}
              </h2>
              <p className="text-sm text-charcoal/60">
                {mode === 'login' && 'Track campaigns, chat with brands, and monitor payouts.'}
                {mode === 'signup' && '3 quick steps. Curated dashboards tailor to your role.'}
                {mode === 'forgot' && "We'll send a secure reset link to your inbox."}
              </p>
            </div>

            <div className="mt-8">
              {mode === 'login' && renderLoginForm()}
              {mode === 'signup' && renderSignupForm()}
              {mode === 'forgot' && renderForgotForm()}
            </div>

            <div className="mt-10 text-center text-sm text-charcoal/60">
              {mode === 'login' ? (
                <>
                  New here?{' '}
                  <Link to="/signup" className="text-sage hover:underline">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already part of LumiCollab?{' '}
                  <Link to="/login" className="text-sage hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}