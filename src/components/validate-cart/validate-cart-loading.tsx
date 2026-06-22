export default function ValidateCartLoading() {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}
        >
          Please Wait...
        </div>
  
        <div
          style={{
            fontSize: '18px',
            marginBottom: '24px'
          }}
        >
          Validating Cart...
        </div>
  
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #d9d9d9',
            borderTop: '4px solid #0070d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
    );
  }