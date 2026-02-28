import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Share2, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

const CandidateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                // Since our API currently returns all candidates, we might need to filter manually 
                // OR implement a get_by_id endpoint. For now, we'll try to fetch all and find (or assuming endpoint exists)
                // Actually, assuming standard REST: /recruitment/candidates/:id
                // But my python backend doesn't have that specific GET yet (it has list and delete/put).
                // Let's check recruitment.py... only has GET / (list), PUT /:id, DELETE /:id.
                // So I need to fetch all and filter, or add endpoints.
                // Fetching all for now because I don't want to touch backend again if not strictly needed, 
                // but adding GET /:id is cleaner. I will add it.

                // Let's try to fetch all and filter to be safe for now, 
                // as I want to minimize backend restarts/edits if possible, 
                // but actually I'll add the endpoint.

                const res = await api.get(`/recruitment/candidates`);
                const found = res.data.find(c => (c.id).toString() === id);
                setCandidate(found);
            } catch (error) {
                console.error("Error fetching candidate", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    if (!candidate) return <div className="text-center py-20 text-slate-500">Candidate not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/recruitment')}>Back to Pipeline</Button>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                <div className="relative flex justify-between items-end mb-6 mt-12 px-2">
                    <div className="flex items-end gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg rotate-3 hover:rotate-0 transition-all duration-300">
                            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {(candidate.full_name || 'U').charAt(0)}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl font-bold text-slate-800">{candidate.full_name}</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                {candidate.role} <span className="text-slate-300">•</span> {candidate.status}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-2">
                        <Button variant="outline" icon={Share2}>Share</Button>
                        <Button variant="gradient" icon={Edit}>Edit Profile</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 border-t border-slate-100 pt-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{candidate.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-sm font-medium">+1 (555) 000-0000</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Remote / New York</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Application Rating</h3>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`h-2 w-full rounded-full ${i < (candidate.rating || 0) ? 'bg-amber-400' : 'bg-slate-100'}`} />
                                ))}
                            </div>
                            <p className="text-right text-xs text-slate-400 mt-2 font-medium">{candidate.rating}/5 Score</p>
                        </div>
                    </div>

                    <div className="col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">About</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Experienced professional with a strong background in {candidate.role}.
                                Passionate about technology and innovation. Proven track record of delivering high-quality results.
                                (This is placeholder text. Add 'bio' to backend models to make this dynamic.)
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Resume / CV</h3>
                            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 group-hover:text-indigo-700">Resume.pdf</p>
                                        <p className="text-xs text-slate-400">Added on {new Date(candidate.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost">Download</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;
