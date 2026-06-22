interface ValidationResultsHeaderProps {
    onReturn?: () => void;
  }
  
  export default function ValidationResultsHeader({
    onReturn
  }: ValidationResultsHeaderProps) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 400
          }}
        >
          Validation Results
        </h1>
  
        <button
          type="button"
          onClick={onReturn}
          style={{
            padding: '10px 16px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Return to Cart
        </button>
      </div>
    );
  }