import React, { useEffect } from "react";
import { useHobitMutateDeleteApi } from "../../hooks/hobitAdmin";
import { FaqDeleteRequest, FaqDeleteResponse } from "../../types/faq";

interface FaqDeleteProps {
    faq_id: number;
    onDeleteComplete: (success: boolean) => void; 
}

const FaqDelete: React.FC<FaqDeleteProps> = ({ faq_id, onDeleteComplete }) => {
    const deleteApi = useHobitMutateDeleteApi<FaqDeleteRequest, FaqDeleteResponse>("faqs", String(faq_id));

    useEffect(() => {
        const deleteFaq = async () => {
            try {
                const response = await deleteApi();
                onDeleteComplete(!!response); 
            } catch (error) {
                console.error("FAQ 삭제 중 오류 발생:", error);
                onDeleteComplete(false);
            }
        };

        deleteFaq();
    }, [deleteApi, faq_id, onDeleteComplete]);

    return null; 
};

export default FaqDelete;