
import { useEffect, useState } from "react";
import {
    getAllAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getMarketingCustomers,
} from "../api.js";

export default function Advertisements() {
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [sendingId, setSendingId] = useState(null);
    const [sendResult, setSendResult] = useState(null);

    const emptyForm = {
        title: "",
        description: "",
        imageUrl: "",
        active: true,
    };

    const [form, setForm] = useState(emptyForm);

    async function loadAdvertisements() {
        try {
            setLoading(true);
            setError("");
            const data = await getAllAdvertisements();
            setAdvertisements(data);
        } catch (err) {
            setError(err.message || "Unable to load advertisements");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAdvertisements();
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function openAddForm() {
        setForm(emptyForm);
        setEditId(null);
        setShowForm(true);
    }

    function openEditForm(ad) {
        setForm({
            title: ad.title || "",
            description: ad.description || "",
            imageUrl: ad.imageUrl || "",
            active: ad.active,
        });
        setEditId(ad.id);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.title.trim() || !form.description.trim() || !form.imageUrl.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            setSaving(true);

            const advertisement = {
                title: form.title.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim(),
                active: form.active,
            };

            if (editId !== null) {
                await updateAdvertisement(editId, advertisement);
            } else {
                await createAdvertisement(advertisement);
            }

            setShowForm(false);
            setForm(emptyForm);
            setEditId(null);
            await loadAdvertisements();
        } catch (err) {
            alert(err.message || "Unable to save advertisement");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this advertisement?"
        );

        if (!confirmed) return;

        try {
            await deleteAdvertisement(id);
            await loadAdvertisements();
        } catch (err) {
            alert(err.message || "Unable to delete advertisement");
        }
    }

    async function handleSendAdvertisement(ad) {
        try {
            setSendingId(ad.id);

            const customers = await getMarketingCustomers();

            setSendResult({
                title: ad.title,
                count: customers.length,
            });
        } catch (err) {
            alert(err.message || "Unable to fetch customers");
        } finally {
            setSendingId(null);
        }
    }

    const filteredAdvertisements = advertisements.filter((ad) =>
        `${ad.title} ${ad.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const activeCount = advertisements.filter((ad) => ad.active).length;
    const inactiveCount = advertisements.length - activeCount;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#174D38]">
                        Advertisements
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage promotional offers for Green Basket Mart customers.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="rounded-xl bg-[#174D38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103b2a]"
                >
                    + Add Advertisement
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Advertisements</p>
                    <p className="mt-2 text-3xl font-bold text-[#174D38]">
                        {advertisements.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {activeCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="mt-2 text-3xl font-bold text-gray-500">
                        {inactiveCount}
                    </p>
                </div>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-bold text-[#174D38]">
                        {editId !== null ? "Edit Advertisement" : "Add Advertisement"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Advertisement Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Example: Fresh Fruits Offer"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#174D38]"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter advertisement details"
                                rows="3"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#174D38]"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#174D38]"
                                required
                            />
                        </div>

                        {/* Image Preview */}
                        {form.imageUrl && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">
                                    Image Preview
                                </p>
                                <img
                                    src={form.imageUrl}
                                    alt="Advertisement preview"
                                    className="h-40 w-full rounded-xl border border-gray-200 object-cover sm:w-72"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                    onLoad={(e) => {
                                        e.currentTarget.style.display = "block";
                                    }}
                                />
                            </div>
                        )}

                        <label className="flex items-center gap-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={handleChange}
                                className="h-4 w-4 accent-[#174D38]"
                            />
                            Active advertisement
                        </label>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#174D38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#103b2a] disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editId !== null
                                        ? "Update Advertisement"
                                        : "Save Advertisement"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setForm(emptyForm);
                                    setEditId(null);
                                }}
                                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search advertisements..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#174D38] sm:max-w-md"
                />
            </div>

            {/* Advertisement Cards */}
            {loading ? (
                <p className="py-10 text-center text-gray-500">
                    Loading advertisements...
                </p>
            ) : error ? (
                <p className="py-10 text-center text-red-600">{error}</p>
            ) : filteredAdvertisements.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center">
                    <p className="font-medium text-gray-600">
                        No advertisements found.
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                        Add an advertisement to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredAdvertisements.map((ad) => (
                        <div
                            key={ad.id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <img
                                src={ad.imageUrl}
                                alt={ad.title}
                                className="h-48 w-full bg-gray-100 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                            <div className="space-y-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-bold text-[#174D38]">
                                        {ad.title}
                                    </h3>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ad.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {ad.active ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <p className="line-clamp-3 text-sm text-gray-500">
                                    {ad.description}
                                </p>

                                <div className="flex gap-3 border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => openEditForm(ad)}
                                        className="flex-1 rounded-lg border border-[#174D38] px-4 py-2 text-sm font-semibold text-[#174D38] hover:bg-green-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleSendAdvertisement(ad)}
                                        disabled={!ad.active || sendingId === ad.id}
                                        className="w-full rounded-lg bg-[#174D38] px-4 py-2 text-sm font-semibold text-white hover:bg-[#103b2a] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {sendingId === ad.id ? "Processing..." : "Send to Customers"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {sendResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                        <div className="mb-4 text-5xl text-green-600">✓</div>

                        <h2 className="text-xl font-bold text-[#174D38]">
                            Advertisement Sent Successfully!
                        </h2>

                        <p className="mt-3 text-sm text-gray-600">
                            "{sendResult.title}" is ready for
                            {" "}{sendResult.count} opted-in customers.
                        </p>

                        <p className="mt-3 text-xs text-gray-400">
                            Demo notification only. No actual SMS messages were sent.
                        </p>

                        <button
                            onClick={() => setSendResult(null)}
                            className="mt-6 w-full rounded-xl bg-[#174D38] px-5 py-3 font-semibold text-white hover:bg-[#103b2a]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
