export default function UserDto(data) {
  return {
    userId: data.user_id,
    email: data.user_email,
    role: data.role,
  }
}
