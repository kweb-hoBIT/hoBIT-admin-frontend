import React from "react";
import { useFaqCreateLogic } from "./FaqCreateMainLogic";
import InputField from "../InputField";
import Button from "../Button";

const FaqCreateMain: React.FC = () => {
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
        addFAQs,
    } = useFaqCreateLogic();

    return (
        <div className="w-full bg-pink-200 text-black font-semibold text-sm p-2 rounded-md transition-colors duration-300">
            <div className="createFaqs_back">
                <div className="mainCategory_inner">
                    <InputField
                        id="mainCategory"
                        className="rounded-md"
                        label="메인 카테고리"
                        type="text"
                        value={mainCategory}
                        onChange={(e) => setMainCategory(e.target.value)}
                        placeholder="enter main category"
                    />
                </div>
                <div className="subCategory_inner">
                    <InputField
                        id="subCategory"
                        className="rounded-md"
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
                        className="rounded-md"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="enter question"
                    />
                </div>
                <div className="parent-container flex items-center h-120 overflow-auto flex-row gap-5">
                    {answers.map((answer, index) => (
                        <div
                            className="rounded-md flex flex-col gap-2 p-2 bg-gray-400 m-2 w-48"
                            key={index}
                        >
                            {index !== 0 && (
                                <Button
                                    onClick={() => setAnswers(answers.filter((_, i) => i !== index))}
                                    type="button"
                                    children="삭제"
                                    className=""
                                />
                            )}
                            <InputField
                                id="answer"
                                className="rounded-md"
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
                                className="rounded-md"
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
                                className="rounded-md"
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
                                className="rounded-md"
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
                    <div className="add_answer flex items-center justify-center h-full">
                        <Button
                            onClick={addAnswer}
                            to=""
                            type="button"
                            children="추가하기"
                            className="a"
                        />
                    </div>
                </div>
                <div className="manager_inner">
                    <InputField
                        type="text"
                        label="관리자"
                        className="rounded-md"
                        id="manager"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        placeholder="enter manager"
                    />
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="translate_button">
                        <Button
                            onClick={translateFAQs}
                            type="button"
                            children={isTranslated ? '원본' : '번역하기'}
                            className=""
                        />
                    </div>
                    <div className="post_button">
                        <Button
                            onClick={addFAQs}
                            className=""
                            type="button"
                            children="FAQ 추가하기"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqCreateMain;
