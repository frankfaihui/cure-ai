// import ChatBotUI from '@/components/ChatBotUI';
import { fetchUsers } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';

export function HomePage() {
  const {
    data,
  } = useQuery({
    queryKey: ['health'],
    queryFn: fetchUsers,
  });
  console.log("🚀 ~ HomePage ~ data:", data)

  return (
    <>
      {/* <ChatBotUI /> */}
      <div>test</div>
    </>
  );
}
