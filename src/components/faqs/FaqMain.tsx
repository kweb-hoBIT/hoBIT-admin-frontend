import React, { useState } from "react";
import Swal from "sweetalert2";
import Button from "../Button";

interface FaqMainProps {
    faqs: any[];
    itemPerPage: number;
    totalPage: number;
    setFaqs: React.Dispatch<React.SetStateAction<any[]>>;
}

const FaqMain: React.FC<FaqMainProps> = ({ faqs, itemPerPage, totalPage, setFaqs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFaq, setSelectedFaq] = useState<any>(null);
    const startIndex = (currentPage - 1) * itemPerPage;
    const currentData = faqs.slice(startIndex, startIndex + itemPerPage);

    function handleDelete(faq_id: number) {
        Swal.fire({
            title: "삭제하시겠습니까?",
            text: "이 FAQ는 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api/faqs/${faq_id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        Swal.fire("삭제되었습니다!", "", "success");
                        setFaqs(faqs.filter((faq) => faq.faq_id !== faq_id));
                    } else {
                        Swal.fire("삭제 실패", "다시 시도해 주세요.", "error");
                    }
                } catch (error) {
                    Swal.fire("삭제 실패", "서버 오류가 발생했습니다.", "error");
                }
            }
        });
    }

    return (
        <div>
            <div className="faqs_back relative">
                <div className="faqs">
                    <div className="faqs_inner">
                        {currentData.map((faq) => (
                            <div
                                key={faq.faq_id}
                                className="w-full bg-pink-200 text-gray-600 font-semibold text-sm p-2 rounded-md transition-colors duration-300 mb-1 inline-block relative"
                            >
                                <span className="mx-2">{faq.faq_id}</span>
                                <span className="mx-2">{faq.maincategory_ko}</span>
                                <span className="mx-2">{faq.subcategory_ko}</span>
                                <span className="mx-2">{faq.question_ko}</span>
                                <span className="mx-2">{faq.created_at}</span>
                                <span className="mx-2">{faq.updated_at}</span>
                                <span className="mx-2">{faq.manager}</span>
                                <div id="btn_place" className="relative inline-flex gap-3">
                                    <Button
                                        type="button"
                                        children="수정"
                                        className="edit_btn"
                                        onClick={() => {}}
                                        to={`/faqs/edit/${faq.faq_id}`}
                                    ></Button>
                                    <Button
                                        type="button"
                                        children="삭제"
                                        to=""
                                        className="delete_btn"
                                        onClick={() => handleDelete(faq.faq_id)}
                                    ></Button>
                                    <Button
                                        type="button"
                                        children="세부사항"
                                        className="details_btn"
                                        onClick={() => {}}
                                        to={`/faqs/${faq.faq_id}`}
                                    ></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="page text-center mt-5">
                {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(Number(page))}
                        className={`px-3 py-1 mx-1 rounded-md cursor-pointer ${
                            currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <div className="addFaqs text-center mt-5">
                <Button
                    to={"new"}
                    type="button"
                    children="FAQ 추가하기"
                    className=""
                ></Button>
            </div>
        </div>
    );
};

export default FaqMain;
