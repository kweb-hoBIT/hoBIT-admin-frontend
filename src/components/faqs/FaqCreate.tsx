import React, { useState } from "react";
import { useHobitMutatePostApi, useHobitMutatePutApi, useHobitQueryGetApi } from "../../hooks/hobitAdmin";
import { FaqGetRequest, FaqGetResponse, FaqPostRequest, FaqPostResponse, FaqPutRequest, FaqPutResponse } from "../../types/faq";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectAuth } from "../../redux/authSlice";

export const useFaqCreateLogic = () => {
    const { user_id } = useSelector((state: RootState) => selectAuth(state));
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [question, setQuestion] = useState('');
    const [manager, setManager] = useState('');
    const [answers, setAnswers] = useState([{ answer: '', url: '', email: '', phone: '' }]);

    const [originalData, setOriginalData] = useState({
        mainCategory: '',
        subCategory: '',
        question: '',
        manager: '',
        answers: [{ answer: '', url: '', email: '', phone: '' }],
    });

    const [isTranslated, setIsTranslated] = useState(false);

    const faqTranslateApi = useHobitMutatePostApi<FaqPostRequest, FaqPostResponse>('translate');
    const faqPutApi = useHobitMutatePostApi<FaqPutRequest, FaqPutResponse>('faqs');

    const addAnswer = () => {
        setAnswers([...answers, { answer: '', url: '', email: '', phone: '' }]);
    };

    const translateText = async (text: string): Promise<string> => {
        try {
            const response = await faqTranslateApi({ text });
            const data: any = response;
            return data.payload.translatedText;
        } catch (error) {
            console.error('Translation API Error:', error);
            throw error;
        }
    };

    const translateFAQs = async () => {
        if (!isTranslated) {
            setOriginalData({ mainCategory, subCategory, question, manager, answers });
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
    };

    const addFAQs = async () => {
        if (!mainCategory || !subCategory || !question || !manager || answers.length === 0) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        try {
            const [MainCategory_en, SubCategory_en, Question_en, Manager_en] = await Promise.all([
                translateText(mainCategory),
                translateText(subCategory),
                translateText(question),
                translateText(manager),
            ]);

            const Answers_en = await Promise.all(
                answers.map(async (answer) => ({
                    ...answer,
                    answer: await translateText(answer.answer),
                }))
            );

            const faqs = {
                user_id: user_id,
                maincategory_ko: mainCategory,
                maincategory_en: MainCategory_en,
                subcategory_ko: subCategory,
                subcategory_en: SubCategory_en,
                question_ko: question,
                question_en: Question_en,
                answer_ko: answers,
                answer_en: Answers_en,
                manager: manager,
            };

            const response = await faqPutApi(faqs);

            if (!response) {
                console.error('Failed to add FAQ:');
                alert('FAQ 추가에 실패했습니다.'); 
            } else {
                alert('FAQ가 성공적으로 추가되었습니다.');
            }
        } catch (error) {
            console.error('Error adding FAQs:', error);
            alert('FAQ 추가 중 오류가 발생했습니다.');
        }
    };

    return {
        mainCategory,
        subCategory,
        question,
        manager,
        answers,
        isTranslated,
        setMainCategory,
        setSubCategory,
        setQuestion,
        setManager,
        setAnswers,
        addAnswer,
        translateFAQs,
        addFAQs,
    };
};
