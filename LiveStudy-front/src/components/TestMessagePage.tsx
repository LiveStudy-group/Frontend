// src/pages/BlockTestPage.tsx
import MessageItem from '../components/MessageItem';
import { useEffect } from 'react';
import { useBlockUserStore } from '../store/blockUserStore';

const dummyMessages = [
  {
    senderId: 'user-a',
    nickname: '홍길동',
    profileImage: 'https://via.placeholder.com/40',
    message: '안녕하세요',
    timestamp: new Date().toISOString(),
    isMyMessage: false,
    isContinuous: false,
  },
  {
    senderId: 'user-a',
    nickname: '홍길동',
    profileImage: 'https://via.placeholder.com/40',
    message: '이 메시지도 보이면 안 돼요',
    timestamp: new Date().toISOString(),
    isMyMessage: false,
    isContinuous: true,
  },
  {
    senderId: 'user-me',
    nickname: '나',
    profileImage: 'https://via.placeholder.com/40',
    message: '나는 차단하지 않았어',
    timestamp: new Date().toISOString(),
    isMyMessage: true,
    isContinuous: false,
  }
];

const BlockTestPage = () => {
  const blockUser = useBlockUserStore((state) => state.blockUser);

  useEffect(() => {
    // user-a를 차단한 상태로 시작
    blockUser('user-a');
  }, [blockUser]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">차단 메시지 테스트</h2>
      {dummyMessages.map((msg, index) => (
        <MessageItem key={index} {...msg} />
      ))}
    </div>
  );
};

export default BlockTestPage;