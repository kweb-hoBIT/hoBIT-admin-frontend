import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const FAQsPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort_option, setSortOption] = useState<'id' | 'latest'>('id');
  const [searching, setSearching] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    searching:'',
    id: '',
    mainCategory: '',
    subCategory: '',
    manager: ''
  });

  const itemPerPage = 6;
  const startIndex = (currentPage - 1) * itemPerPage;

  const filteredFAQs = [...faqs]
  .filter((faq) => {
    const matchesSearchTerm =
      String(faq.faq_id).toLowerCase().includes(searching.toLowerCase()) ||
      faq.maincategory_ko.toLowerCase().includes(searching.toLowerCase()) ||
      faq.subcategory_ko.toLowerCase().includes(searching.toLowerCase()) ||
      faq.question_ko.toLowerCase().includes(searching.toLowerCase()) ||
      faq.manager.toLowerCase().includes(searching.toLowerCase());

    const matchesFilter =
      (!filter.mainCategory || faq.maincategory_ko.toLowerCase().includes(filter.mainCategory.toLowerCase())) &&
      (!filter.subCategory || faq.subcategory_ko.toLowerCase().includes(filter.subCategory.toLowerCase())) &&
      (!filter.manager || faq.manager.toLowerCase().includes(filter.manager.toLowerCase())) &&
      (!String(filter.id) || String(faq.faq_id).toLowerCase().includes(filter.id.toLowerCase()));

    if (isModalOpen) {
      return matchesFilter;
    } else {
      return matchesSearchTerm && matchesFilter; 
    }
  })
  .sort((a, b) => {
    if (sort_option === 'id') {
      return a.id - b.id;
    } else if (sort_option === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });


  const currentData = filteredFAQs.slice(startIndex, startIndex + itemPerPage);
  const totalPage = Math.ceil(filteredFAQs.length / itemPerPage);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch('http://localhost:5000/api/faqs', { method: 'GET' });
        const data = await response.json();
        setFaqs(data.faqs);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      }
    }

    fetchFAQs();
  }, []);

  function initModal() {
    setFilter({
      id: '',
      searching: '',
      mainCategory: '',
      subCategory: '',
      manager: ''
    })
  }

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
      <Header />

      <main>
        <h1 className="text-xl font-bold mb-4">FAQ 검색</h1>

        <div className="search_back" style={{ position: 'relative' }}>
          <div className="search">
            <div className="search_inner">
              <div className="detail_btn" style={{ position: 'relative', display: 'inline-block' }}>
                <span onClick={() => setIsModalOpen(true)}>필터 열기</span>
              </div>
              <input
                type="text"
                style={{ position: 'relative', display: 'inline-block' }}
                name="search_box"
                placeholder="search for faqs"
                autoComplete="off"
                value={searching}
                onChange={(e) => setSearching(e.target.value)}
              />
            </div>
          </div>
        </div>

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
                <label>id : </label>
                <input
                  type="text"
                  value={filter.id}
                  onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                  placeholder="id"
                />
              </div>
              <div>
                <label>메인 카테고리 : </label>
                <input
                  type="text"
                  value={filter.mainCategory}
                  onChange={(e) => setFilter({ ...filter, mainCategory: e.target.value })}
                  placeholder="메인 카테고리"
                />
              </div>
              <div>
                <label>서브 카테고리 : </label>
                <input
                  type="text"
                  value={filter.subCategory}
                  onChange={(e) => setFilter({ ...filter, subCategory: e.target.value })}
                  placeholder="서브 카테고리"
                />
              </div>
              <div>
                <label>매니저 : </label>
                <input
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

        <div className="filter_back" style={{ position: 'relative' }}>
          <div className="filter">
            <div className="filter_inner">
              <div className="order_by" style={{ position: 'relative', display: 'inline-block' }}>
                <label className="order_by_list">
                  <span>이미지 예정</span>
                  <select
                    value={sort_option}
                    onChange={(e) => setSortOption(e.target.value as 'id' | 'latest')}
                  >
                    <option value="id">ID</option>
                    <option value="latest">최신 등록순</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="faqs_back" style={{ position: 'relative' }}>
          <div className="faqs">
            <div className="faqs_inner">
              {currentData.map((faq) => (
                <div
                  key={faq.id}
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
                  <button
                    style={{ margin: '10px' }}
                  >
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
              onClick={() => setCurrentPage(page)}
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

        <div className='addFaqs' style={{ textAlign: 'center', marginTop: '20px' }}>
          <button>faq 추가하기</button>
        </div>
      </main>
    </div>
  );
};

export default FAQsPage;
