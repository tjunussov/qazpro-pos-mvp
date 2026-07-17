export default function RolePlaceholder({ role }) {
  const label = role.charAt(0).toUpperCase() + role.slice(1)
  return (
    <div className="role-placeholder">
      <h1>{label}</h1>
      <p>Coming soon</p>
    </div>
  )
}
