import { connectToDatabase } from '@/lib/mongodb'
import Lead from '@/models/Lead'

export async function POST(req) {
  try {
    const body = await req.json()
    await connectToDatabase()
    const lead = await Lead.create(body)
    return Response.json({ success: true, lead })
  } catch (error) {
    console.error('💥 ERROR AL GUARDAR LEAD:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const leads = await Lead.find().sort({ createdAt: -1 })
    return Response.json({ success: true, leads })
  } catch (error) {
    console.error('💥 ERROR AL OBTENER LEADS:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await connectToDatabase();
    await Lead.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
