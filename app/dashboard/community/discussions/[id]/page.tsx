'use client';
import { useParams } from 'next/navigation';

export default function DiscussionPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Discussion {id}</h1>
      <div style={{ marginTop: '24px' }}>
        <strong>Welcome to the discussion board!</strong>
        <p style={{ marginTop: '10px' }}>
          Share your thoughts, ask questions, or help others by replying below. This is a space for collaborative learning and engaging conversations. Whether you have tips, resources, or just want to connect with fellow students, feel free to participate!
        </p>
        <p style={{ marginTop: '10px', color: '#888' }}>
          (More features coming soon: replies, upvotes, and more!)
        </p>
        <div style={{ marginTop: '24px', textAlign: 'left', maxWidth: 600, margin: '24px auto 0 auto', background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          {id === '1' && (
            <>
              <strong>Message Log:</strong>
              <ul>
                <li><b>Alex Chen:</b> I find it helpful to break down complex biological processes into flowcharts. Does anyone have tips for memorizing the steps of cellular respiration?</li>
                <li><b>Maria Rodriguez:</b> Using mnemonics for taxonomy and organelles really helps me. Also, I recommend watching short animations for topics like mitosis and meiosis.</li>
                <li><b>James Wilson:</b> Quizlet has lots of biology flashcard decks. I also like relating new terms to real-life examples, like comparing cell parts to factory roles.</li>
                <li><b>Priya Patel:</b> Don’t forget to check out the university’s biology tutoring sessions—they’re super helpful before exams!</li>
              </ul>
            </>
          )}
          {id === '2' && (
            <>
              <strong>Message Log:</strong>
              <ul>
                <li><b>Maria Rodriguez:</b> Does anyone have a good way to remember the difference between definite and indefinite integrals?</li>
                <li><b>Alex Chen:</b> I made a summary sheet of all the integration techniques (substitution, by parts, partial fractions) if anyone wants a copy!</li>
                <li><b>James Wilson:</b> Khan Academy’s calculus playlist is great for reviewing concepts. Also, the practice problems at the end of each textbook chapter are really useful.</li>
                <li><b>Emily Zhao:</b> For the final, don’t forget to review series convergence tests and Taylor expansions—they’re always on the exam!</li>
              </ul>
            </>
          )}
          {id === '3' && (
            <>
              <strong>Message Log:</strong>
              <ul>
                <li><b>James Wilson:</b> What’s the best way to organize notes on different psychological theories? I get confused between behaviorism and cognitive psychology.</li>
                <li><b>Maria Rodriguez:</b> I use color-coded mind maps for each theory and include key experiments. Also, check out the APA’s website for summaries and resources.</li>
                <li><b>Alex Chen:</b> For research projects, Google Scholar and PsycINFO are my go-to databases. Don’t forget to cite your sources in APA format!</li>
                <li><b>Sara Kim:</b> If you’re interested in mental health, the campus counseling center sometimes hosts guest lectures on current topics in psychology.</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
