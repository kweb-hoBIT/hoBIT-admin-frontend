import React from "react";
import { useFaqEditLogic } from "./FaqEditMainLogic";
import InputField from "../InputField";
import Button from "../Button";

interface FaqEditMainProps {
    faqId: number;
}

const FaqEditMain: React.FC<FaqEditMainProps> = ({ faqId }) => {
    const {
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
        EditFAQs,
    } = useFaqEditLogic(faqId);

    return (
        <div className="w-full bg-pink-200 text-black font-semibold text-sm p-2 rounded-md transition-colors duration-300">
            <div className="EditFaqs_back">
                <div className="mainCategory_inner">
                    <InputField
                        id="mainCategory"
                        className="mainCategory"
                        label="메인 카테고리"
                        type="text"
                        value={mainCategory}
                        onChange={(e) => setMainCategory(e.target.value)}
                        placeholder="enter main category"
                    />
                </div>
                <div className="subCategory_inner">
                    <InputField
                        id='subCategory'
                        className="subCategory"
                        label="서브 카테고리"
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="enter subcategory"
                    />
                </div>
                <div className="question_inner">
                    <InputField
                        id="question"
                        label="질문"
                        className="question"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="enter question"
                    />
                </div>
                <div className="parent-container flex items-center h-120 overflow-auto gap-5 flex-row">
                    {answers.map((answer, index) => (
                        <div
                            className="rounded-md bg-gray-400 p-2 m-2 w-48 flex flex-col gap-2"
                            key={index}
                        >
                            {index !== 0 && (
                                <Button
                                    onClick={() => setAnswers(answers.filter((_, i) => i !== index))}
                                    children="삭제"
                                    type="button"
                                    className=""
                                ></Button>
                            )}
                            <InputField
                                id="answer"
                                className="answer"
                                label="답변"
                                type="text"
                                value={answer.answer}
                                onChange={(e) =>
                                    setAnswers(
                                        answers.map((a, i) =>
                                            i === index ? { ...a, answer: e.target.value } : a
                                        )
                                    )
                                }
                                placeholder="enter answer"
                            />
                            <InputField
                                id="URL"
                                className="URL"
                                label="URL"
                                type="text"
                                value={answer.url}
                                onChange={(e) =>
                                    setAnswers(
                                        answers.map((a, i) =>
                                            i === index ? { ...a, url: e.target.value } : a
                                        )
                                    )
                                }
                                placeholder="enter URL"
                            />
                            <InputField
                                id="Email"
                                className="Email"
                                label="email"
                                type="text"
                                value={answer.email}
                                onChange={(e) =>
                                    setAnswers(
                                        answers.map((a, i) =>
                                            i === index ? { ...a, email: e.target.value } : a
                                        )
                                    )
                                }
                                placeholder="enter email"
                            />
                            <InputField
                                id="PhoneNum"
                                className="PhoneNum"
                                label="전화번호"
                                type="text"
                                value={answer.phone}
                                onChange={(e) =>
                                    setAnswers(
                                        answers.map((a, i) =>
                                            i === index ? { ...a, phone: e.target.value } : a
                                        )
                                    )
                                }
                                placeholder="enter phone number"
                            />
                        </div>
                    ))}
                    <div className="add_answer">
                        <Button
                            onClick={addAnswer}
                            type="button"
                            className=""
                            children="추가하기"
                        ></Button>
                    </div>
                </div>
                <div className="manager_inner">
                    <InputField
                        type="text"
                        label="관리자"
                        id="manager"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        className=""
                        placeholder="enter manager"
                    />
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="translate_button">
                        <Button
                            onClick={translateFAQs}
                            type="button"
                            className=""
                            children={isTranslated ? "원본" : "번역하기"}
                        ></Button>
                    </div>
                    <div className="post_button">
                        <Button
                            onClick={EditFAQs}
                            type="button"
                            className=""
                            children="FAQ 수정하기"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqEditMain;
