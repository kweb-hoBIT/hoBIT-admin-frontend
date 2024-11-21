import React from "react";
import InputField from "../InputField";
import Button from "../Button";

interface FaqSearchModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filter: {
        searching: string;
        id: string;
        mainCategory: string;
        subCategory: string;
        manager: string;
    };
    setFilter: React.Dispatch<React.SetStateAction<any>>;
}

const FaqSearchModal: React.FC<FaqSearchModalProps> = ({ isModalOpen, setIsModalOpen, filter, setFilter }) => {

    function initModal() {
        setFilter({
            searching: '',
            id: '',
            mainCategory: '',
            subCategory: '',
            manager: ''
        });
    }

    return (
        <div>
            {isModalOpen && (
                <div
                    className="modal"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        className="modal-content"
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            minWidth: '500px',
                            zIndex: 1001
                        }}
                    >
                        <h3>필터 설정</h3>
                        <div>
                            <InputField
                                id="modalId"
                                className="modalId"
                                label="id : "
                                type="text"
                                value={filter.id}
                                onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                                placeholder="id"
                            />
                        </div>
                        <div>
                            <InputField
                                id="modalMain"
                                className="modalMain"
                                label='메인 카테고리 : '
                                type="text"
                                value={filter.mainCategory}
                                onChange={(e) => setFilter({ ...filter, mainCategory: e.target.value })}
                                placeholder="메인 카테고리"
                            />
                        </div>
                        <div>
                            <InputField
                                id="modalSub"
                                className="modalSub"
                                label="서브 카테고리 : "
                                type="text"
                                value={filter.subCategory}
                                onChange={(e) => setFilter({ ...filter, subCategory: e.target.value })}
                                placeholder="서브 카테고리"
                            />
                        </div>
                        <div>
                            <InputField
                                id='modalManager'
                                className="modalManager"
                                label="매니저 : "
                                type="text"
                                value={filter.manager}
                                onChange={(e) => setFilter({ ...filter, manager: e.target.value })}
                                placeholder="매니저"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                marginTop: '10px',
                                marginRight: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            닫기
                        </button>
                        <button
                            onClick={() => initModal()}
                            style={{
                                marginTop: '10px',
                                marginRight: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            초기화
                        </button>
                    </div>
                </div>
            )}
        </div> 
    )
}

export default FaqSearchModal;
