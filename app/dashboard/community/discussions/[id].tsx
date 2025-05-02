import { useRouter } from 'next/router';

export default function Discussion() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Discussion {id}</h1>
      <p>This is a placeholder page for discussion {id}. Content will be available soon.</p>
    </div>
  );
}
