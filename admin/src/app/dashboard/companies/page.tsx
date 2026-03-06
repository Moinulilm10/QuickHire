"use client";

import SearchInput from "@/components/ui/SearchInput";
import { CompanyPayload, companyService } from "@/services/company.service";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Company {
  id: number;
  uuid: string;
  name: string;
  location: string;
  logo: string | null;
  jobs: any[];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company> | null>(
    null,
  );
  const [formData, setFormData] = useState<CompanyPayload>({
    name: "",
    location: "",
    logo: "",
  });

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getCompanies();
      if (data.success) {
        setCompanies(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openModal = (company?: Company) => {
    if (company) {
      setCurrentCompany(company);
      setFormData({
        name: company.name,
        location: company.location,
        logo: company.logo || "",
      });
    } else {
      setCurrentCompany(null);
      setFormData({ name: "", location: "", logo: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = currentCompany
        ? await companyService.updateCompany(currentCompany.id!, formData)
        : await companyService.createCompany(formData);

      if (res.success) {
        setIsModalOpen(false);
        fetchCompanies();
      }
    } catch (error) {
      console.error("Failed to save company", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await companyService.deleteCompany(id);
      if (res.success) {
        fetchCompanies();
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-24 font-bold text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company profiles and details.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      {/* Tools */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <SearchInput
          placeholder="Search companies..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-96"
        />
      </div>

      {/* Table grid */}
      <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium text-foreground">
                  Company
                </th>
                <th className="px-6 py-4 font-medium text-foreground">
                  Location
                </th>
                <th className="px-6 py-4 font-medium text-foreground">
                  Active Jobs
                </th>
                <th className="px-6 py-4 font-medium text-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-surface-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {company.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {company.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {company.jobs?.length || 0} jobs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(company)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-foreground">
                {currentCompany ? "Edit Company" : "Add Company"}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) =>
                      setFormData({ ...formData, logo: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-surface-border flex justify-end gap-3 bg-surface-muted/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {currentCompany ? "Save Changes" : "Add Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
