import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import yaml from 'js-yaml';
import type { Script } from '@/lib/types';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { script, userId } = await request.json();
    
    if (!script || !userId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const scriptData = await prisma.script.create({
      data: {
        title: script.meta?.title || '未命名剧本',
        content: JSON.stringify(script),
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      script: {
        id: scriptData.id,
        title: scriptData.title,
        createdAt: scriptData.createdAt,
      },
    });
  } catch (error) {
    console.error('Save script error:', error);
    return NextResponse.json(
      { error: '保存失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const scripts = await prisma.script.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      scripts: scripts.map(s => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get scripts error:', error);
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少剧本ID' },
        { status: 400 }
      );
    }

    await prisma.script.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete script error:', error);
    return NextResponse.json(
      { error: '删除失败，请稍后重试' },
      { status: 500 }
    );
  }
}
