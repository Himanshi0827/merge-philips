interface ValidationSuccessProps {
    show: boolean;
  }
  
  export default function ValidationSuccess({
    show
  }: ValidationSuccessProps) {
    if (!show) {
      return null;
    }
  
    return (
      <div
        style={{
          backgroundColor: '#eaf7ea',
          border: '1px solid #5cb85c',
          padding: '16px',
          color: '#3c763d',
          fontWeight: 'bold'
        }}
      >
        Validation Successful
      </div>
    );
  }