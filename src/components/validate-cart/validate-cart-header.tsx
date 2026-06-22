interface ValidateCartHeaderProps {
  quoteName?: string;
  onBack?: () => void;
  onClose?: () => void;
}
  
  export default function ValidateCartHeader({
    quoteName,
    onBack,
    onClose
  }: ValidateCartHeaderProps) {
    return (
      <div
        style={{
          backgroundColor: '#243B53',
          color: 'white',
          padding: '16px 24px',
          margin: '-20px -20px 24px -20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          {/* Back Arrow */}
  
          <span
            onClick={onBack}
            style={{
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ←
          </span>
  
          {/* Philips Logo Text */}
  
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#0070d2'
            }}
          >
            PHILIPS
          </div>
  
          {/* Separator */}
  
          <span
            style={{
              color: '#ffffff80'
            }}
          >
            |
          </span>
  
          {/* Proposal */}
  
          <div>
            Proposal: {quoteName}
          </div>
        </div>
  
        {/* Close Button */}
  
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    );
  }