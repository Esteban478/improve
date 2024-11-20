export const Progress: React.FC<{ value?: number }> = ({ value }) => (
  <div data-testid="mock-progress" data-value={value}>
    Progress Mock
  </div>
)

export default Progress