export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Użytkownicy</h2>
          <p className="text-3xl font-bold">128</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Projekty</h2>
          <p className="text-3xl font-bold">25</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Aktywne sesje</h2>
          <p className="text-3xl font-bold">18</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Ostatnia aktywność</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Jan Kowalski</p>
              <p className="text-sm text-gray-500">Zaktualizował projekt</p>
            </div>
            <span className="text-sm text-gray-500">10 minut temu</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Anna Nowak</p>
              <p className="text-sm text-gray-500">Dodała nowego użytkownika</p>
            </div>
            <span className="text-sm text-gray-500">2 godziny temu</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Adam Wiśniewski</p>
              <p className="text-sm text-gray-500">Zmienił ustawienia</p>
            </div>
            <span className="text-sm text-gray-500">wczoraj</span>
          </div>
        </div>
      </div>
    </div>
  );
}
