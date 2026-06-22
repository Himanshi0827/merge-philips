interface ValidationWarningsProps {
    warnings?: string[];
  }
  
  export default function ValidationWarnings({
    warnings
  }: ValidationWarningsProps) {
    if (!warnings || warnings.length === 0) {
      return null;
    }
  
    return (
      <div
        style={{
          backgroundColor: '#fff7e6',
          border: '1px solid #f0ad4e',
          padding: '16px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#f0ad4e',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>⚠</span>
  
          <span>
            WARNINGS:
          </span>
        </div>
  
        <ul
          style={{
            margin: 0,
            color: '#f0ad4e'
          }}
        >
          {warnings.map(
            (
              warning,
              index
            ) => (
              <li key={index}>
                {warning}
              </li>
            )
          )}
        </ul>
      </div>
    );
  }