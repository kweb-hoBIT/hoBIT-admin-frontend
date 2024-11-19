import React from "react";
import Swal from 'sweetalert2';

interface FaqMainProps {
    faqs: any[]; 
    itemPerPage: number;
    totalPage: number;
    setFaqs: React.Dispatch<React.SetStateAction<any[]>>;
}

const FaqMain: React.FC<FaqMainProps> = ({ faqs, itemPerPage, totalPage, setFaqs }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    
    const startIndex = (currentPage - 1) * itemPerPage;
    const currentData = faqs.slice(startIndex, startIndex + itemPerPage);

    function handleDelete(faq_id: number) {
        Swal.fire({
            title: '삭제하시겠습니까?',
            text: '이 FAQ는 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api/faqs/${faq_id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        Swal.fire('삭제되었습니다!', '', 'success');
                        setFaqs(faqs.filter((faq) => faq.faq_id !== faq_id));
                    } else {
                        Swal.fire('삭제 실패', '다시 시도해 주세요.', 'error');
                    }
                } catch (error) {
                    Swal.fire('삭제 실패', '서버 오류가 발생했습니다.', 'error');
                }
            }
        });
    }

    return (
        <div>
            <div className="faqs_back" style={{ position: 'relative' }}>
                <div className="faqs">
                    <div className="faqs_inner">
                        {currentData.map((faq) => (
                            <div
                                key={faq.faq_id} 
                                className="faq_item"
                                style={{ position: 'relative', display: 'inline-block' }}
                            >
                                <span style={{ margin: '10px' }}>{faq.faq_id}</span>
                                <span style={{ margin: '10px' }}>{faq.maincategory_ko}</span>
                                <span style={{ margin: '10px' }}>{faq.subcategory_ko}</span>
                                <span style={{ margin: '10px' }}>{faq.question_ko}</span>
                                <span style={{ margin: '10px' }}>{faq.created_at}</span>
                                <span style={{ margin: '10px' }}>{faq.updated_at}</span>
                                <span style={{ margin: '10px' }}>{faq.manager}</span>
                                <button style={{ margin: '10px' }}>
                                    수정
                                </button>
                                <button
                                    style={{ margin: '10px' }}
                                    onClick={() => handleDelete(faq.faq_id)} 
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="page" style={{ textAlign: 'center', marginTop: '20px' }}>
                {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(Number(page))}
                        style={{
                            padding: '5px 10px',
                            margin: '0 5px',
                            backgroundColor: currentPage === page ? '#007bff' : '#ddd',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <div className="addFaqs" style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="faqs/new">faq 추가하기</a>
            </div>
        </div>
    );
};

export default FaqMain;
