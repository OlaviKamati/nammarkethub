import { useState } from 'react'
import { supabase } from '../lib/supabase'

const INPUT = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  background: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: 10,
  color: '#FAFAF8',
  outline: 'none',
}

// Handles both direct file upload (to Supabase Storage) and manual URL entry.
// Calls onChange(url) with whatever the final image URL is.
export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [mode, setMode] = useState('url') // 'url' | 'upload'

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.')
      return
    }

    setUploading(true)
    setUploadError(null)

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `products/${filename}`

    const { error } = await supabase.storage
      .from('product-photos')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    setUploading(false)

    if (error) {
      setUploadError('Upload failed. Try again or use a URL instead.')
      return
    }

    const { data } = supabase.storage.from('product-photos').getPublicUrl(path)
    onChange(data.publicUrl)
  }

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#111', borderRadius: 8, padding: 3, marginBottom: 10, width: 'fit-content', border: '1px solid #2A2A2A' }}>
        {['url', 'upload'].map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: mode === m ? 'linear-gradient(135deg, #C9A84C, #9A7A2E)' : 'transparent',
              color: mode === m ? '#0A0A0A' : '#A0A09A' }}>
            {m === 'url' ? '🔗 URL' : '📁 Upload'}
          </button>
        ))}
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={INPUT}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div>
          <label style={{ display: 'block', border: '1px dashed #2A2A2A', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#111', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            {uploading ? (
              <p style={{ fontSize: 13, color: '#C9A84C' }}>Uploading…</p>
            ) : (
              <>
                <p style={{ fontSize: 20, marginBottom: 6 }}>📸</p>
                <p style={{ fontSize: 13, color: '#A0A09A' }}>Click to select an image</p>
                <p style={{ fontSize: 11, color: '#555', marginTop: 4 }}>JPG, PNG, WebP · Max 5MB</p>
              </>
            )}
          </label>
          {uploadError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{uploadError}</p>}
        </div>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={value} alt="Preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #2A2A2A' }}
            onError={e => e.currentTarget.style.display = 'none'} />
          <div>
            <p style={{ fontSize: 11, color: '#C9A84C', marginBottom: 2 }}>Preview</p>
            <button type="button" onClick={() => onChange('')}
              style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
