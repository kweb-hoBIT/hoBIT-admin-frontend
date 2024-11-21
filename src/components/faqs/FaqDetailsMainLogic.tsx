import React, { useState, useEffect } from "react";

export const useFaqDetailsLogic = (faqId: number) => {
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [question, setQuestion] = useState('');
    const [manager, setManager] = useState('');
    const [answers, setAnswers] = useState([{ answer: '', url: '', email: '', phone: '' }]);
    const [isEn, setIsEn] = useState(false);
    const [faq, setFaq] = useState({
        faq_id: NaN,
        maincategory_ko: '',
        maincategory_en: '',
        subcategory_ko: '',
        subcategory_en: '',
        question_ko: '',
        question_en: '',
        answer_ko: [],
        answer_en: [],
        manager: ''
    });

    const addAnswer = () => {
        setAnswers([...answers, { answer: '', url: '', email: '', phone: '' }]);
    };

    async function EditInit() {
        try {
            const response = await fetch(`http://localhost:5000/api/faqs/${faqId}`, {
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            });
            const datas = await response.json();
            const data = datas.faq;
            setFaq(data);
            setMainCategory(data.maincategory_ko);
            setSubCategory(data.subcategory_ko);
            setQuestion(data.question_ko);
            setManager(data.manager);
            setAnswers(data.answer_ko);
        } catch(error) {
            console.log(error);
        }
        
    }

    const FaqLang = () => {
        if (isEn) {
            setMainCategory(faq.maincategory_ko);
            setSubCategory(faq.subcategory_ko);
            setQuestion(faq.question_ko);
            setAnswers(faq.answer_ko);
            setIsEn(false);
        } else {
            setMainCategory(faq.maincategory_en);
            setSubCategory(faq.subcategory_en);
            setQuestion(faq.question_en);
            setAnswers(faq.answer_en);
            setIsEn(true);
        }
    }

    useEffect(() => {
        if (faqId) {
            EditInit();
        }
    }, [faqId]);

    return {
        mainCategory,
        subCategory,
        question,
        manager,
        answers,
        setMainCategory,
        setSubCategory,
        setQuestion,
        setManager,
        setAnswers,
        addAnswer,
        FaqLang,
        isEn
    };
};
