import { ProgressStats } from "@/types/certification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./ProgressBar";
import { Trophy, Clock, Calendar, Flame } from "lucide-react";

interface StatsPanelProps {
  stats: ProgressStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const overallProgress = (stats.completedHours / stats.totalHours) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Overall Progress */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-primary" />
            Progression Globale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {Math.round(overallProgress)}%
          </div>
          <ProgressBar 
            value={stats.completedHours} 
            max={stats.totalHours}
            showText={false}
            variant="success"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {stats.completedHours}h sur {stats.totalHours}h
          </p>
        </CardContent>
      </Card>
      
      {/* Days Progress */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-secondary" />
            Jours Complétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {stats.completedDays}/{stats.totalDays}
          </div>
          <ProgressBar 
            value={stats.completedDays} 
            max={stats.totalDays}
            showText={false}
            variant="default"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round((stats.completedDays / stats.totalDays) * 100)}% terminé
          </p>
        </CardContent>
      </Card>
      
      {/* Streak */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="w-5 h-5 text-warning" />
            Série Actuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 flex items-center gap-2">
            {stats.streak}
            {stats.streak > 0 && <Flame className="w-6 h-6 text-warning" />}
          </div>
          <Badge variant={stats.streak > 0 ? "default" : "secondary"} className="mb-2">
            {stats.streak > 0 ? `${stats.streak} jour${stats.streak > 1 ? 's' : ''} consécutif${stats.streak > 1 ? 's' : ''}` : 'Commencez votre série !'}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Maintenez votre rythme !
          </p>
        </CardContent>
      </Card>
      
      {/* Time Stats */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-accent" />
            Temps Investi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {stats.completedHours}h
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Temps restant: {stats.totalHours - stats.completedHours}h
            </p>
            <p className="text-sm text-muted-foreground">
              Moyenne: {stats.completedDays > 0 ? Math.round((stats.completedHours / stats.completedDays) * 10) / 10 : 0}h/jour
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Phase Progress */}
      <Card className="md:col-span-2 lg:col-span-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle>Progression par Phase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <ProgressBar 
                value={stats.phase1Progress} 
                max={100}
                label="Phase 1: Fondamentaux"
                variant="ml"
              />
            </div>
            <div>
              <ProgressBar 
                value={stats.phase2Progress} 
                max={100}
                label="Phase 2: Spécialisation AWS ML"
                variant="aws"
              />
            </div>
            <div>
              <ProgressBar 
                value={stats.phase3Progress} 
                max={100}
                label="Phase 3: Approfondissement"
                variant="terraform"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};