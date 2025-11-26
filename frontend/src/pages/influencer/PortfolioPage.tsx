import { useState, useRef } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

const sidebarItems = [
  { label: 'Dashboard', href: '/influencer/dashboard' },
  { label: 'My Profile', href: '/influencer/profile' },
  { label: 'Portfolio Uploads', href: '/influencer/portfolio' },
  { label: 'My Applications', href: '/influencer/campaigns' },
  { label: 'Messaging', href: '/influencer/messaging' },
  { label: 'Earnings', href: '/influencer/earnings' },
  { label: 'Settings', href: '/settings' },
]

const media = [
  { id: 1, type: 'photo', title: 'Nova Glow shoot', size: '2.1 MB' },
  { id: 2, type: 'photo', title: 'AeroFit launch', size: '1.8 MB' },
  { id: 3, type: 'video', title: 'Vista vlog snippet', size: '14 MB' },
  { id: 4, type: 'photo', title: 'StrideX motion', size: '2.7 MB' },
]

export const PortfolioPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      // TODO: Implement file upload API call
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate upload
      alert(`Successfully uploaded ${files.length} file(s)!`)
    } catch (error) {
      alert('Upload failed. Please try again.')
      console.error(error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleEdit = (item: typeof media[0]) => {
    alert(`Editing: ${item.title}`)
  }

  const handleDelete = (item: typeof media[0]) => {
    if (confirm(`Delete "${item.title}"?`)) {
      alert(`Deleted: ${item.title}`)
    }
  }

  return (
    <DashboardLayout
      title="Portfolio & media"
      subtitle="Upload high-res assets for brands to review"
      sidebarItems={sidebarItems}
      actionSlot={<button className="cta" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload media'}</button>}
    >
      <div className="portfolio-upload card">
        <label className="upload-field dashed" onClick={handleUpload} style={{ cursor: 'pointer' }}>
          Drop photos or videos here
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        <p className="tiny">Max 100MB per video · Accepted: JPG, PNG, MP4, MOV</p>
      </div>
      <div className="media-grid">
        {media.map((item) => (
          <div key={item.id} className="card media-card">
            <div className={`thumb ${item.type}`} />
            <div>
              <h4>{item.title}</h4>
              <p>{item.size}</p>
            </div>
            <div className="actions">
              <button className="link tiny" onClick={() => handleEdit(item)}>Edit</button>
              <button className="link tiny warning" onClick={() => handleDelete(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

