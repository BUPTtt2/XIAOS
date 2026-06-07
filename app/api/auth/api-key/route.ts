import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { userId, apiKey } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { apiKey },
    });

    return NextResponse.json({
      success: true,
      message: 'API Key 更新成功',
      user: { id: user.id, email: user.email, name: user.name, apiKey: user.apiKey },
    });
  } catch (error) {
    console.error('API Key update error:', error);
    return NextResponse.json(
      { error: '更新失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户 ID 不能为空' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { apiKey: null },
    });

    return NextResponse.json({
      success: true,
      message: 'API Key 已删除',
      user: { id: user.id, email: user.email, name: user.name, apiKey: user.apiKey },
    });
  } catch (error) {
    console.error('API Key delete error:', error);
    return NextResponse.json(
      { error: '删除失败，请稍后重试' },
      { status: 500 }
    );
  }
}
