import { Button } from "@/components/ui/button";
import { mockHistory } from "@/lib/mockData";
import { Eye } from "lucide-react";

const HistoryPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Past Briefs</h1>
        <p className="mt-2 text-muted-foreground">Every keyword you've researched and the briefs Khoji built for them.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        <table className="w-full">
          <thead className="bg-background/50 border-b border-border">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 font-semibold">Keyword</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockHistory.map((row) => (
              <tr key={row.id} className="text-sm hover:bg-background/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{row.keyword}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">{row.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-foreground">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;