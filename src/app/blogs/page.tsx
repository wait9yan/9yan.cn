import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章',
};

export default function Blogs() {
  return (
    <>
      <div>
        <h2>
          九言<span>@wait9yan</span>
        </h2>
        <p>我的文章</p>
      </div>
    </>
  );
}
