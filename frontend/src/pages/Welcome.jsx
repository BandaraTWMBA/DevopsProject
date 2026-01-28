// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* Header */}
            <h1 className="text-xl text-gray-800 mb-2">Welcome to</h1>
            <h2 className="text-4xl font-bold text-blue-600 mb-10 tracking-tight">
                myfitnesspal<span className="text-xs align-top">®</span>
            </h2>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl  p-1 flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" alt="Workout" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4 bg-gray-800/80 p-2 rounded-lg text-white text-left shadow-lg backdrop-blur-sm border border-white/10">
                            <div className="text-xs text-gray-300 font-medium mb-1">Protein <span className="float-right ml-2 text-gray-400">Last 7 days</span></div>
                            <div className="flex items-end gap-1 h-8">
                                <div className="w-1 bg-yellow-400 h-3 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-5 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-4 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-7 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-6 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-8 rounded-t-sm"></div>
                                <div className="w-1 bg-yellow-400 h-5 rounded-t-sm"></div>
                            </div>
                            <div className="flex justify-between text-[0.5rem] mt-1 text-gray-400">
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Ready for some wins?</h3>
                    <p className="text-gray-600">Start tracking, it’s easy!</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl  p-1 flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1512428559087-560fa5ce7d87?q=80&w=2070&auto=format&fit=crop" alt="Food" className="w-full h-full object-cover" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 w-40 text-left">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-blue-600">myfitnesspal</span>
                            </div>
                            <div className="text-sm font-bold text-gray-800 mb-1">Today</div>
                            <div className="relative w-20 h-20 mx-auto my-2">
                                <div className="w-full h-full rounded-full border-4 border-orange-400 flex items-center justify-center flex-col">
                                    <span className="text-sm font-bold text-gray-800">1,250</span>
                                    <span className="text-[0.6rem] text-gray-500">Remaining</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-center border-t border-gray-100 pt-2">
                                <div>
                                    <div className="mb-0.5" >🔥</div>
                                    <div className="text-[0.6rem] text-gray-500">400</div>
                                </div>
                                <div>
                                    <div className="mb-0.5">👟</div>
                                    <div className="text-[0.6rem] text-gray-500">650</div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Discover the impact of</h3>
                    <p className="text-gray-600">your food and fitness</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl  p-1 flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" alt="Bowl" className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 backdrop-blur-md bg-white/30 p-3 rounded-xl shadow-lg border border-white/20 w-24">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-800 font-medium">Protein</span>
                            </div>
                            <div className="text-xl font-bold text-gray-800 mb-3">32</div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-800 font-medium">Fat</span>
                            </div>
                            <div className="text-xl font-bold text-gray-800 mb-3">20</div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-800 font-medium">Carbs</span>
                            </div>
                            <div className="text-xl font-bold text-gray-800">57</div>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">And make mindful eating</h3>
                    <p className="text-gray-600">a habit for life</p>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={() => navigate("/home")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded shadow-md transition-all duration-200 tracking-wide"
            >
                CONTINUE
            </button>
        </div>
    );
}
