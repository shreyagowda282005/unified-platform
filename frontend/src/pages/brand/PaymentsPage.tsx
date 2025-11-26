import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { StatCard } from '../../components/StatCard'
import { paymentService } from '../../services/paymentService'

const sidebarItems = [
  { label: 'Dashboard', href: '/brand/dashboard' },
  { label: 'Create Campaign', href: '/brand/create-campaign' },
  { label: 'Manage Campaigns', href: '/brand/manage-campaigns' },
  { label: 'Browse Influencers', href: '/brand/browse-influencers' },
  { label: 'Messaging', href: '/brand/messaging' },
  { label: 'Payments', href: '/brand/payments' },
  { label: 'Settings', href: '/settings' },
]

const payments = [
  { influencer: 'Ayla Rivers', amount: '$4,200', status: 'Scheduled', invoice: '#INV-1024' },
  { influencer: 'Leo Miles', amount: '$9,400', status: 'Paid', invoice: '#INV-1020' },
  { influencer: 'Mara Holt', amount: '$2,800', status: 'Pending', invoice: '#INV-1016' },
]

export const PaymentsPage = () => {
  const [amount, setAmount] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!amount || !email) {
      alert('Please fill in both amount and email')
      return
    }
    setLoading(true)
    try {
      // TODO: Implement payment API call
      await paymentService.createPayment({ amount, influencerEmail: email })
      alert('Payment initiated successfully!')
      setAmount('')
      setEmail('')
    } catch (error) {
      alert('Payment failed. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (invoice: string) => {
    // TODO: Implement invoice download
    alert(`Downloading ${invoice}...`)
  }

  const handleSend = (invoice: string) => {
    // TODO: Implement invoice sending
    alert(`Sending ${invoice}...`)
  }

  return (
    <DashboardLayout title="Payments" subtitle="Trigger payouts & review invoices" sidebarItems={sidebarItems}>
      <div className="grid stats">
        <StatCard label="Total paid" value="$198K" />
        <StatCard label="Pending" value="$14K" variant="accent" />
        <StatCard label="Invoices" value="64" />
      </div>
      <div className="card">
        <div className="input-row">
          <input 
            placeholder="Amount" 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input 
            placeholder="Influencer email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="cta" onClick={handlePay} disabled={loading}>
            {loading ? 'Processing...' : 'Pay via Stripe'}
          </button>
        </div>
        <p className="tiny">Secure payouts through Stripe or Razorpay with escrow logic.</p>
      </div>
      <div className="card table">
        <div className="table-head">
          <span>Influencer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Invoice</span>
          <span>Actions</span>
        </div>
        {payments.map((payment) => (
          <div className="table-row" key={payment.invoice}>
            <span>{payment.influencer}</span>
            <span>{payment.amount}</span>
            <span className={`pill tiny ${payment.status === 'Paid' ? 'success' : 'warning'}`}>{payment.status}</span>
            <span>{payment.invoice}</span>
            <span className="table-actions">
              <button className="link tiny" onClick={() => handleDownload(payment.invoice)}>Download</button>
              <button className="link tiny" onClick={() => handleSend(payment.invoice)}>Send</button>
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

