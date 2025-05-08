'use client';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

interface Reply {
  author: string;
  content: string;
}
interface Comment {
  author: string;
  content: string;
  replies: Reply[];
}

const initialCommentsById: Record<string, Comment[]> = {
  '1': [
    { author: 'Alex Chen', content: 'I find it helpful to break down complex biological processes into flowcharts. Does anyone have tips for memorizing the steps of cellular respiration?', replies: [] },
    { author: 'Maria Rodriguez', content: 'Using mnemonics for taxonomy and organelles really helps me. Also, I recommend watching short animations for topics like mitosis and meiosis.', replies: [] },
    { author: 'James Wilson', content: 'Quizlet has lots of biology flashcard decks. I also like relating new terms to real-life examples, like comparing cell parts to factory roles.', replies: [] },
    { author: 'Priya Patel', content: 'Don’t forget to check out the university’s biology tutoring sessions—they’re super helpful before exams!', replies: [] },
  ],
  '2': [
    { author: 'Maria Rodriguez', content: 'Does anyone have a good way to remember the difference between definite and indefinite integrals?', replies: [] },
    { author: 'Alex Chen', content: 'I made a summary sheet of all the integration techniques (substitution, by parts, partial fractions) if anyone wants a copy!', replies: [] },
    { author: 'James Wilson', content: 'Khan Academy’s calculus playlist is great for reviewing concepts. Also, the practice problems at the end of each textbook chapter are really useful.', replies: [] },
    { author: 'Emily Zhao', content: 'For the final, don’t forget to review series convergence tests and Taylor expansions—they’re always on the exam!', replies: [] },
  ],
  '3': [
    { author: 'James Wilson', content: 'What’s the best way to organize notes on different psychological theories? I get confused between behaviorism and cognitive psychology.', replies: [] },
    { author: 'Maria Rodriguez', content: 'I use color-coded mind maps for each theory and include key experiments. Also, check out the APA’s website for summaries and resources.', replies: [] },
    { author: 'Alex Chen', content: 'For research projects, Google Scholar and PsycINFO are my go-to databases. Don’t forget to cite your sources in APA format!', replies: [] },
    { author: 'Sara Kim', content: 'If you’re interested in mental health, the campus counseling center sometimes hosts guest lectures on current topics in psychology.', replies: [] },
  ],
};

export default function DiscussionPage() {
  const params = useParams();
  const id = params?.id as string;
  // 当前登录用户（从 localStorage 读取）
  const [currentUser, setCurrentUser] = useState('Current User');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUser(localStorage.getItem('username') || 'Current User');
    }
  }, []);

  // 评论和回复状态
  const [comments, setComments] = useState<Comment[]>(initialCommentsById[id] || []);
  const [newComment, setNewComment] = useState('');
  const [replyBoxIdx, setReplyBoxIdx] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // 新增评论
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { author: currentUser, content: newComment.trim(), replies: [] },
    ]);
    setNewComment('');
  };

  // 展开回复框
  const handleReplyClick = (idx: number) => {
    setReplyBoxIdx(idx);
    setReplyContent('');
  };

  // 提交回复
  const handleAddReply = (idx: number) => {
    if (!replyContent.trim()) return;
    const updated = [...comments];
    updated[idx].replies.push({ author: currentUser, content: replyContent.trim() });
    setComments(updated);
    setReplyBoxIdx(null);
    setReplyContent('');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Discussion {id}</h1>
      <div style={{ marginTop: '24px' }}>
        <strong>Welcome to the discussion board!</strong>
        <p style={{ marginTop: '10px' }}>
          Share your thoughts, ask questions, or help others by replying below. This is a space for collaborative learning and engaging conversations. Whether you have tips, resources, or just want to connect with fellow students, feel free to participate!
        </p>
        <div style={{ marginTop: '24px', textAlign: 'left', maxWidth: 600, margin: '24px auto 0 auto', background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <strong>Message Log:</strong>
          <ul style={{ marginBottom: 20 }}>
            {comments.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 16 }}>
                <b>{c.author}:</b> {c.content}
                <div style={{ marginLeft: 24, marginTop: 6 }}>
                  <button style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} onClick={() => handleReplyClick(idx)}>
                    Reply
                  </button>
                  {c.replies.length > 0 && (
                    <ul style={{ marginTop: 8 }}>
                      {c.replies.map((r, ridx) => (
                        <li key={ridx} style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>
                          <b>{r.author}:</b> {r.content}
                        </li>
                      ))}
                    </ul>
                  )}
                  {replyBoxIdx === idx && (
                    <div style={{ marginTop: 8 }}>
                      <input
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        style={{ fontSize: 13, padding: 4, width: '80%' }}
                      />
                      <button style={{ marginLeft: 8, fontSize: 13 }} onClick={() => handleAddReply(idx)}>
                        Send
                      </button>
                      <button style={{ marginLeft: 4, fontSize: 13, color: '#888' }} onClick={() => setReplyBoxIdx(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a new comment..."
              style={{ fontSize: 14, padding: 6, width: '80%' }}
            />
            <button style={{ marginLeft: 8, fontSize: 14 }} onClick={handleAddComment}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
