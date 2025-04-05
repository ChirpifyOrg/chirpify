"use server";
import { NextRequest, NextResponse } from "next/server";
import { TranslateLearnSentenceService } from "@/be/infrastructure/service/translate-learn-sentence-service";
import { TranslateLearnFeedbackService } from "@/be/infrastructure/service/translate-learn-feedback-service";


const apiKey = process.env.OPENAI_API_KEY;

async function handleSentenceRequest(level: number, selectedOptions: string[], language: string) {
    if (!apiKey) {
        throw new Error("API key is not defined");
    }
    const service = new TranslateLearnSentenceService(apiKey);
    const result = await service.generateLearningContent(level, selectedOptions, language);
    return NextResponse.json(result);
}

async function handleFeedbackRequest(question: string, answer: string){
    
    if (!apiKey) {
        throw new Error("API key is not defined");
    }

    const feedbackService = new TranslateLearnFeedbackService(apiKey);
    const result = await feedbackService.generateFeedback(question , answer);
    return NextResponse.json(result);
}

export async function POST(request: NextRequest, { params }: { params: { translateCategory: string } }) {
    try {
        const { level, selectedOptions, question, answer, language } = await request.json();
        const { translateCategory } = await params;

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "API key not found" }, { status: 500 });
        }
        
        if (translateCategory === 'sentence') {
            return handleSentenceRequest(level, selectedOptions, language);
        } else if (translateCategory === 'feedback') {
            return handleFeedbackRequest(question, answer);
        } else {
            return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}