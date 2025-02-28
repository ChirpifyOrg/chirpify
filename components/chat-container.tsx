import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";


interface ChatContainerProps {
    persona: string;
    mode : "full" | "trial";    
}

export function ChatContainer({persona, mode}: ChatContainerProps) {
    const STORAGE_KEY = "trial_message_count";
    const maxTrialCount = Number(process.env.NEXT_PUBLIC_MAX_TRIAL_COUNT) || 5;
    // 메시지 카운트 상태 관리
    const [messageCount, setMessageCount] = useState<number>(5);
    
    // (() => 
    //     mode === "trial" ? Number(localStorage.getItem(STORAGE_KEY)) || 0 : 0
    // );
    // 체험판 종료 상태 관리 
    const [isTrialEnded, setIsTrialEnded] = useState<boolean>(() => {
        if (mode === "trial") {
            const storedCount = Number(localStorage.getItem(STORAGE_KEY)) || 0;
            return storedCount >= maxTrialCount;
        }
        return false;
    });

    useEffect(() => {
        if (mode === "trial" && messageCount >= maxTrialCount) {
            setIsTrialEnded(true);
          }  
    }, [messageCount]);


    const handleAddMessageCount = () => {
        setMessageCount(prev => {
            const newCount = prev + 1;
            localStorage.setItem(STORAGE_KEY, String(newCount)); // 저장
            return newCount;
        });
    };
    

    return (
        
        <div>
            
             <img src={`/images/${persona}.png`} alt={persona}  style={{ width: "800px", height: "auto" }} />
            { isTrialEnded ? (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
               <Card>
                    <CardHeader>
                        <CardTitle>체험판 종료</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-center text-muted-foreground">
                            체험판 사용이 종료되었습니다. 계속해서 Chirpify를 사용하시려면 회원가입을 해주세요.
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => window.location.href="/"}>
                                취소
                            </Button>
                            <Button onClick={() => window.location.href="/sign-up"}>
                                회원가입
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                </div>
            ) : (
                <div>test2</div>
                // <ChatOrganism persona={persona} mode={mode} />
            )}
        </div>
    )
}