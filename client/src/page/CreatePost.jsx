import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import {
  FormField,
  Loader,
} from '../components';
import { getRandomPrompt } from '../utils';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://ai-image-generation-server-xrop.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Vui lòng cung cấp thông tin hợp lệ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://ai-image-generation-server-xrop.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Chia sẻ thành công');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Vui lòng tạo ảnh với các chi tiết hợp lệ');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Tạo mới</h1>
        <p className="mt-2 text-[#666e75] text-[14px]">Tạo một hình ảnh đầy tưởng tượng thông qua trí tuệ nhân tạo DALL-E và chia sẻ nó với cộng đồng</p>
      </div>

      <form className="mt-5 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
        <FormField
          labelName="Tên của bạn"
          type="text"
          name="name"
          placeholder="Ví dụ: Hữu Tuấn"
          value={form.name}
          handleChange={handleChange}
        />

          <FormField
            labelName="Gợi ý"
            type="text"
            name="prompt"
            placeholder="Một người đàn ông lang thang trên những con đường mưa ở Tokyo, với những biển hiệu đèn neon sáng chói, 50mm"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Đang tạo ảnh ...' : 'Tạo ảnh'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Khi bạn đã tạo được hình ảnh mong muốn, bạn có thể chia sẻ nó với những người khác trong cộng đồng **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Đang chia sẻ ...' : 'Chia sẻ với cộng đồng'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
