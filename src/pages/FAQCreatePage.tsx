import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';

const FAQCreatePage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [manager, setManager] = useState('');
  const [answers, setAnswers] = useState([
    { answer: '', url: '', email: '', phone: '' },
  ]);

  const [originalData, setOriginalData] = useState({
    mainCategory: '',
    subCategory: '',
    question: '',
    manager: '',
    answers: [{ answer: '', url: '', email: '', phone: '' }],
  });

  const [isTranslated, setIsTranslated] = useState(false);

  const addAnswer = () => {
    setAnswers([...answers, { answer: '', url: '', email: '', phone: '' }]);
  };

  async function translateFAQs() {
    if (!isTranslated) {
      setOriginalData({
        mainCategory,
        subCategory,
        question,
        manager,
        answers,
      });

      try {
        const translatedMainCategory = await translateText(mainCategory);
        const translatedSubCategory = await translateText(subCategory);
        const translatedQuestion = await translateText(question);
        const translatedManager = await translateText(manager);
        const translatedAnswers = await Promise.all(
          answers.map(async (answer) => ({
            ...answer,
            answer: await translateText(answer.answer),
          }))
        );

        setMainCategory(translatedMainCategory);
        setSubCategory(translatedSubCategory);
        setQuestion(translatedQuestion);
        setManager(translatedManager);
        setAnswers(translatedAnswers);

        setIsTranslated(true);
      } catch (error) {
        console.error('Translation Error:', error);
        alert('Translation failed.');
      }
    } else {
      setMainCategory(originalData.mainCategory);
      setSubCategory(originalData.subCategory);
      setQuestion(originalData.question);
      setManager(originalData.manager);
      setAnswers(originalData.answers);

      setIsTranslated(false);
    }
  }

  async function translateText(text: string): Promise<string> {
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation API Error:', error);
      throw error;
    }
  }

  async function addFAQs() {
    setOriginalData({
      mainCategory,
      subCategory,
      question,
      manager,
      answers,
    });
    const MainCategory_ko = mainCategory;
    const SubCategory_ko = subCategory;
    const Question_ko = question;
    const Answers_ko = answers;
    const Manager_ko = manager;

    const MainCategory_en = await translateText(mainCategory);
    const SubCategory_en = await translateText(subCategory);
    const Question_en = await translateText(question);
    const Manager_en = await translateText(manager);
    const Answers_en = await Promise.all(
      answers.map(async (answer) => ({
        ...answer,
        answer: await translateText(answer.answer),
      }))
    );

    const jsonAnswers_ko = { ...Answers_ko };
    const jsonAnswers_en = { ...Answers_en };

    const faqs = {
      user_id: 1234,   //일단 임시로
      MainCategory_ko,
      MainCategory_en,
      SubCategory_ko,
      SubCategory_en,
      Question_ko,
      Question_en,
      jsonAnswers_ko,
      jsonAnswers_en,
      manager
    };  // 여긴 안되는데 이유는 알 수 없음.

    try {
      await fetch('http://localhost:5000/api/faqs/'), {
        method: 'POST',
        body: JSON.stringify({ faqs })
      }
    } catch {
      console.log('fail');
    }  

    console.log('FAQs Data:', JSON.stringify(faqs, null, 2));
  };

  return (
    <div>
      <Header />
      <main>
        <h1 className="text-xl font-bold mb-4">FAQ 추가</h1>
        <div className="createFaqs_back">
          <div className="mainCategory_inner">
            <span>메인 카테고리</span>
            <input
              type="text"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              autoComplete="off"
              placeholder="enter main category"
            />
          </div>
          <div className="subCategory_inner">
            <span>서브 카테고리</span>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              autoComplete="off"
              placeholder="enter subcategory"
            />
          </div>
          <div className="question_inner">
            <span>질문</span>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              autoComplete="off"
              placeholder="enter question"
            />
          </div>
          <span>답변</span>
          <div className="answer_inner" style={{ overflow: 'auto', display: 'flex', flexDirection: 'row', gap: '20px' }}>
            {answers.map((answer, index) => (
              <div
                className="answer_box"
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: '#AAAAAA',
                  margin: '10px',
                  width: '200px',
                }}
              >
                {index !== 0 && (
                  <button onClick={() => setAnswers(answers.filter((_, i) => i !== index))}>삭제</button>
                )}
                <input
                  type="text"
                  value={answer.answer}
                  onChange={(e) =>
                    setAnswers(
                      answers.map((a, i) =>
                        i === index ? { ...a, answer: e.target.value } : a
                      )
                    )
                  }
                  autoComplete="off"
                  placeholder="enter answer"
                />
                <input
                  type="text"
                  value={answer.url}
                  onChange={(e) =>
                    setAnswers(
                      answers.map((a, i) =>
                        i === index ? { ...a, url: e.target.value } : a
                      )
                    )
                  }
                  autoComplete="off"
                  placeholder="enter URL"
                />
                <input
                  type="text"
                  value={answer.email}
                  onChange={(e) =>
                    setAnswers(
                      answers.map((a, i) =>
                        i === index ? { ...a, email: e.target.value } : a
                      )
                    )
                  }
                  autoComplete="off"
                  placeholder="enter email"
                />
                <input
                  type="text"
                  value={answer.phone}
                  onChange={(e) =>
                    setAnswers(
                      answers.map((a, i) =>
                        i === index ? { ...a, phone: e.target.value } : a
                      )
                    )
                  }
                  autoComplete="off"
                  placeholder="enter phone number"
                />
              </div>
            ))}
            <div className="add_answer">
              <button style={{ margin: '10px' }} onClick={addAnswer}>
                추가하기
              </button>
            </div>
          </div>
          <div className="manager_inner">
            <span>관리자</span>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              autoComplete="off"
              placeholder="enter manager"
            />
          </div>
          <div className="translate_button">
            <button onClick={translateFAQs}>{isTranslated ? '원본' : '번역하기'}</button>
          </div>
          <div className="post_button">
            <button onClick={addFAQs}>FAQ 추가하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQCreatePage;
