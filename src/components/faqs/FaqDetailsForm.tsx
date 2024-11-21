import React from "react";
import { useFaqDetailsLogic } from "./FaqDetails";
import FaqReader from "./FaqReader";
import Button from "../Button";

interface FaqDetailsMainProps {
    faqId: number;
}

const FaqDetailsMain: React.FC<FaqDetailsMainProps> = ({ faqId }) => {
    const {
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
        FaqLang,
        isEn
    } = useFaqDetailsLogic(faqId);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">FAQ 세부사항</h1>
            <div className="w-full bg-pink-200 text-black font-semibold text-sm p-2 rounded-md transition-colors duration-300">
                <div className="mainCategory_inner">
                    <FaqReader
                        readOnly={true}
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
                    <FaqReader
                        id="subCategory"
                        readOnly={true}
                        className="subCategory"
                        label="서브 카테고리"
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="enter subcategory"
                    />
                </div>
                <div className="question_inner">
                    <FaqReader
                        id="question"
                        label="질문"
                        readOnly={true}
                        className="question"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="enter question"
                    />
                </div>
                <div className="flex overflow-auto gap-5">
                    {answers.map((answer, index) => (
                        <div
                            className="rounded-md bg-gray-400 p-2 m-2 w-48 flex flex-col gap-2"
                            key={index}
                        >
                            <FaqReader
                                id="answer"
                                readOnly={true}
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
                            <FaqReader
                                id="URL"
                                className="URL"
                                readOnly={true}
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
                            <FaqReader
                                id="Email"
                                className="Email"
                                readOnly={true}
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
                            <FaqReader
                                id="PhoneNum"
                                className="PhoneNum"
                                readOnly={true}
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
                </div>
                <div className="manager_inner">
                    <FaqReader
                        type="text"
                        id="manager"
                        label="관리자"
                        className=""
                        readOnly={true}
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        placeholder="enter manager"
                    />
                </div>
                <div>
                    <Button
                        className="faqEn_btn"
                        onClick={FaqLang}
                        type="button"
                        children={isEn ? "원문 보기" : "영어 보기"}
                    />
                </div>
            </div>
        </div>
    );
};

export default FaqDetailsMain;
