export default function UserDto(data) {
  return {
    userId: data.user_id || data.userId,
    email: data.user_email || data.email,
    role: data.role || data.role,
  }
}
