import { NextResponse } from 'next/server';
import { convertNovelToScript } from '@/lib/modelscope';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '缺少小说内容' },
        { status: 400 }
      );
    }

    const result = await convertNovelToScript(content);
    
    return NextResponse.json({ 
      success: true, 
      script: result.script,
      isMock: result.isMock,
      error: result.error 
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: '转换失败，请稍后重试' },
      { status: 500 }
    );
  }
}
