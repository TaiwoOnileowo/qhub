// ModuleBuilder.tsx (parent component)
"use client";
import React, { useState } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import ModuleItem from "./ModuleItem";
import { Accordion } from "@/components/ui/accordion";
import LessonBuilder from "./LessonBuilder";
import QuizBuilder from "../QuizBuilder";

interface ModuleBuilderProps {
  modules: any[];
  setModules: React.Dispatch<React.SetStateAction<any[]>>;
  courseId: string;
  onDeleteModule: (moduleId: string) => void;
}

const ModuleBuilder = ({
  modules,
  setModules,
  courseId,
  onDeleteModule,
}: ModuleBuilderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(
    null
  );
  const [newModule, setNewModule] = useState({
    id: uuidv4(),
    name: "",
    summary: "",
    lessons: [],
    quizzes: [],
  });

  // State for lesson/quiz dialogs
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);

  const handleUpdateModule = () => {
    if (activeModuleIndex !== null) {
      setModules((prev) =>
        prev.map((mod, idx) => (idx === activeModuleIndex ? newModule : mod))
      );
    } else {
      setModules([...modules, newModule]);
    }
    resetModuleState();
  };

  const resetModuleState = () => {
    setActiveModuleIndex(null);
    setNewModule({
      id: uuidv4(),
      name: "",
      summary: "",
      lessons: [],
      quizzes: [],
    });
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNewModule((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditModule = (index: number) => {
    setActiveModuleIndex(index);
    setNewModule(modules[index]);
    setIsOpen(true);
  };

  // Lesson handlers
  const handleAddLesson = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLesson(null);
    setIsLessonDialogOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  const handleSaveLesson = (lessonData: any) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === currentModuleId) {
          if (currentLesson) {
            // Update existing lesson
            return {
              ...module,
              lessons: module.lessons.map((l: any) =>
                l.id === lessonData.id ? lessonData : l
              ),
            };
          } else {
            // Add new lesson
            return {
              ...module,
              lessons: [...module.lessons, lessonData],
            };
          }
        }
        return module;
      })
    );
    setIsLessonDialogOpen(false);
  };

  // Quiz handlers
  const handleAddQuiz = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentQuiz(null);
    setIsQuizDialogOpen(true);
  };

  const handleEditQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    setIsQuizDialogOpen(true);
  };

  const handleSaveQuiz = (quizData: any) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === currentModuleId) {
          if (currentQuiz) {
            // Update existing quiz
            return {
              ...module,
              quizzes: module.quizzes.map((q: any) =>
                q.id === quizData.id ? quizData : q
              ),
            };
          } else {
            // Add new quiz
            return {
              ...module,
              quizzes: [...module.quizzes, quizData],
            };
          }
        }
        return module;
      })
    );
    setIsQuizDialogOpen(false);
  };

  return (
    <div className="p-6 h-full">
      {modules.length === 0 ? (
        <p>No modules created yet</p>
      ) : (
        <Accordion type="single" collapsible className="grid gap-4">
          {modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              module={module}
              moduleIndex={index}
              onEdit={() => handleEditModule(index)}
              onDelete={() => onDeleteModule(module.id)}
              onAddLesson={handleAddLesson}
              onAddQuiz={handleAddQuiz}
              onEditLesson={handleEditLesson}
              onEditQuiz={handleEditQuiz}
            />
          ))}
        </Accordion>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4 flex items-center gap-2">
            <IconCirclePlus className="w-5 h-5" />
            Add New Module
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {activeModuleIndex !== null ? "Edit Module" : "Create Module"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Label htmlFor="name">Module Name *</Label>
            <Input
              id="name"
              value={newModule.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-4">
            <Label htmlFor="summary">Module Summary</Label>
            <Textarea
              id="summary"
              value={newModule.summary}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateModule}
              disabled={!newModule.name.trim()}
            >
              {activeModuleIndex !== null ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentLesson ? "Edit Lesson" : "Create New Lesson"}
            </DialogTitle>
          </DialogHeader>
          <LessonBuilder
            onSave={handleSaveLesson}
            initialLesson={currentLesson}
          />
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentQuiz ? "Edit Quiz" : "Create New Quiz"}
            </DialogTitle>
          </DialogHeader>
          <QuizBuilder
            initialQuiz={currentQuiz}
            onSave={(savedQuiz) => {
              console.log(savedQuiz);

              // Handle saving the quiz to the module
              setModules((prev) =>
                prev.map((module) => {
                  if (module.id === currentModuleId) {
                    if (currentQuiz) {
                      // Update existing quiz
                      return {
                        ...module,
                        quizzes: module.quizzes.map((q: any) =>
                          q.id === savedQuiz.id ? savedQuiz : q
                        ),
                      };
                    } else {
                      // Add new quiz
                      return {
                        ...module,
                        quizzes: [...(module.quizzes || []), savedQuiz],
                      };
                    }
                  }
                  return module;
                })
              );
              setIsQuizDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleBuilder;
