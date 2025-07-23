
import { motion } from "framer-motion";
import { useEffect } from "react";
const DotSlider = ({ totalDots, activeDot, paginateDot, currentPage, color }: {
    totalDots: number, activeDot: number, paginateDot: (index: number) => void, currentPage: number, color: string
}) => {
    useEffect(() => {
        console.log("CURRENT PAGE", currentPage)
    }, [currentPage])
    return (
        <div className="flex gap-[6px] z-10">
            {Array.from({ length: totalDots }).map((_, index) => (
                <motion.div
                    custom={activeDot}
                    key={index}
                    transition={{ duration: 0.5 }}
                    onClick={() => paginateDot(index)}
                    className={`w-3 h-3
                    hover:ring-4 hover:ring-gray-300
                    rounded-full  ${index === currentPage ? "opacity-100" : "opacity-50"
                        }`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
}
export default DotSlider