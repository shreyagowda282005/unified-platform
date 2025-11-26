import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { followService } from '../services/followService'
import './DiscoverUsers.css'

interface User {
  _id: string
  name?: string
  email?: string
  profilePicture?: string
  userType?: 'influencer' | 'brand' | 'admin'
  bio?: string
  followersCount?: number
  location?: string
  isFollowing?: boolean
}

export const DiscoverUsers = () => {
  const { user } = useAuthStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'influencer' | 'brand'>('all')
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadSuggestions()
    resetAndSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadSuggestions() {
    try {
      const data = await followService.getSuggestions(6)
      setSuggestions(data || [])
    } catch (err: any) {
      console.warn('Suggested users load failed', err)
    }
  }

  async function search(pageToLoad = 1) {
    setLoading(pageToLoad === 1)
    if (pageToLoad > 1) setLoadingMore(true)
    try {
      const res = await followService.searchUsers(query, filter === 'all' ? undefined : filter, pageToLoad, limit)
      const items = Array.isArray((res as any).users) ? (res as any).users : (res as any)

      if (pageToLoad === 1) {
        setUsers(items)
      } else {
        setUsers(prev => [...prev, ...items])
      }

      if ((res as any).total !== undefined) {
        const totalPages = Math.ceil((res as any).total / limit)
        setHasMore(pageToLoad < totalPages)
      } else {
        setHasMore(items.length === limit)
      }

      setPage(pageToLoad)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function resetAndSearch() {
    setPage(1)
    setHasMore(true)
    search(1)
  }

  async function handleFollow(userId: string, follow: boolean) {
    if (!user) {
      toast('Please sign in to follow users', { icon: '🔒' })
      return
    }

    try {
      if (follow) {
        await followService.followUser(userId)
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: true, followersCount: (u.followersCount || 0) + 1 } : u))
        setSuggestions(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: true } : u))
      } else {
        await followService.unfollowUser(userId)
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: false, followersCount: Math.max(0, (u.followersCount || 0) - 1) } : u))
        setSuggestions(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: false } : u))
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update follow')
    }
  }

  return (
    <div className="discover-container">
      <header className="discover-header">
        <div className="search-box">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators or brands"
            className="search-input"
            onKeyDown={e => { if (e.key === 'Enter') resetAndSearch() }}
          />
        </div>

        <div className="filter-tabs">
          {(['all', 'influencer', 'brand'] as const).map((t) => (
            <button
              key={t}
              className={`filter-tab ${filter === t ? 'active' : ''}`}
              onClick={() => { setFilter(t); resetAndSearch() }}
            >
              {t === 'all' ? 'All' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <section className="suggestions-section">
        <h3>Suggested for you</h3>
        <div className="suggestions-grid">
          {suggestions.map(s => (
            <div key={s._id} className="suggestion-card">
              <div className="suggestion-avatar">
                {s.profilePicture ? <img src={s.profilePicture} alt={s.name} /> : <div className="avatar-placeholder">{(s.name || 'U').split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()}</div>}
              </div>
              <h4>{s.name}</h4>
              <div className="followers-count">{s.followersCount ?? 0} followers</div>
              <div className="user-actions">
                <button className="pagination-btn" onClick={() => handleFollow(s._id, !s.isFollowing)}>
                  {s.isFollowing ? 'Following' : 'Follow'}
                </button>
                <Link to={`/user/${s._id}`} className="pagination-btn">View</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="users-section">
        <h3>Discover users</h3>

        {loading ? (
          <div className="loading">Loading creators…</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users found</div>
        ) : (
          <div className="users-grid">
            {users.map(u => (
              <div key={u._id} className="user-card">
                <div className="user-avatar">
                  {u.profilePicture ? <img src={u.profilePicture} alt={u.name} /> : <div className="avatar-placeholder">{(u.name || 'U').split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()}</div>}
                </div>

                <div className="user-info">
                  <h4>{u.name}</h4>
                  <div className="user-email">{u.email}</div>
                  {u.userType && <div className="user-type-badge">{u.userType}</div>}
                  {u.bio && <div className="user-bio">{u.bio}</div>}
                  <div className="user-stats">
                    <div>{u.followersCount ?? 0} followers</div>
                    {u.location && <div>{u.location}</div>}
                  </div>
                </div>

                <div className="user-actions">
                  <button
                    className="pagination-btn"
                    onClick={() => handleFollow(u._id, !u.isFollowing)}
                  >
                    {u.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <Link to={`/user/${u._id}`} className="pagination-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => search(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>
          <div className="pagination-info">Page {page}</div>
          <button
            className="pagination-btn"
            onClick={() => search(page + 1)}
            disabled={!hasMore || loadingMore}
          >
            {loadingMore ? 'Loading…' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DiscoverUsers