interface ValidationErrorsProps {
    errors?: string[];
  }
  
  export default function ValidationErrors({
    errors
  }: ValidationErrorsProps) {
    if (!errors || errors.length === 0) {
      return null;
    }
  
    return (
      <div
        style={{
          backgroundColor: '#fdeaea',
          border: '1px solid #d9534f',
          padding: '16px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#d9534f',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>ⓘ</span>
  
          <span>
            ERRORS:
          </span>
        </div>
  
        <ul
          style={{
            margin: 0,
            paddingLeft: '32px',
            color: '#d9534f',
            listStyleType: 'disc'
          }}
        >

          {errors.map(
            (
              error,
              index
            ) => (
              <li
                key={index}
                style={{
                  marginBottom: '6px',
                  display: 'list-item'
                }}
              >
                {error}
              </li>
            )
          )}
        </ul>
      </div>
    );
  }