import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const script = await prisma.script.findUnique({
      where: { id },
    });

    if (!script) {
      return NextResponse.json(
        { error: '剧本不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      script: {
        id: script.id,
        title: script.title,
        content: JSON.parse(script.content),
        createdAt: script.createdAt,
        updatedAt: script.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get script error:', error);
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { script } = await request.json();
    
    if (!script) {
      return NextResponse.json(
        { error: '缺少剧本内容' },
        { status: 400 }
      );
    }

    const updatedScript = await prisma.script.update({
      where: { id },
      data: {
        title: script.meta?.title || '未命名剧本',
        content: JSON.stringify(script),
      },
    });

    return NextResponse.json({
      success: true,
      script: {
        id: updatedScript.id,
        title: updatedScript.title,
        updatedAt: updatedScript.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update script error:', error);
    return NextResponse.json(
      { error: '更新失败，请稍后重试' },
      { status: 500 }
    );
  }
}
