export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Обзор проекта</h1>
        <p className="text-gray-500 mt-1">Статистика вашего виджета и ИИ-ассистента.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Новых заявок</span>
          <span className="text-4xl font-bold text-gray-900 mt-2">12</span>
        </div>
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Сумма заказов</span>
          <span className="text-4xl font-bold text-gray-900 mt-2">450 000 ₸</span>
        </div>
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Диалогов с ИИ</span>
          <span className="text-4xl font-bold text-gray-900 mt-2">84</span>
        </div>
      </div>
    </div>
  );
}