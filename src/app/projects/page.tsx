import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
};

export default function Home() {
  return (
    <>
      <div>
        <h2>
          九言<span>@wait9yan</span>
        </h2>
        <p>我的项目</p>
      </div>
    </>
  );
}
