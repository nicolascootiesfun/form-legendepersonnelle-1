export interface FormData {
  // Step 1
  childFirstName: string;
  childAge: number;
  
  // Step 2
  email: string;
  phoneNumber: string;
  
  // Step 3
  personalityTraits: string[];
  otherPersonalityTrait?: string;
  childPhoto?: File | null;
  preferNoPhoto: boolean;
  additionalCharacteristics: string;
  physicalDescription: string;
  
  // Step 4
  generatedHeroImageUrl?: string;
  heroImageValidated: boolean;
  
  // Step 5
  selectedCharacters: string[];
  characterDetails: {
    [key: string]: {
      name: string;
      photo?: File | null;
      description: string;
    };
  };
  
  // Step 6
  storyStyle: string;
  
  // Step 7
  theme: string;
  problem?: string;
  customProblem?: string;
}

export interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface UserSession {
  id: string;
  email: string;
  token: string;
  validated: boolean;
  created_at: string;
}

export interface GeneratedImage {
  id: string;
  user_session_id: string;
  image_url: string;
  image_type: string;
  status: 'pending' | 'generated' | 'error';
  created_at: string;
}

export const PERSONALITY_TRAITS = [
  "timide", "extraverti", "curieux", "énergique", "créatif", "sensible",
  "malin", "rêveur", "impatient", "autonome", "studieux", "turbulent",
  "calme", "spontané", "sociable", "têtu", "joyeux", "triste", "autre"
] as const;

export const CHARACTER_OPTIONS = [
  "Maman", "Papa", "Frère", "Sœur", "Copain", "Copine", "Animal", "Autre"
] as const;

export const STORY_STYLES = [
  { value: "peu_importe", label: "Peu importe", image: null },
  { value: "aventuriers", label: "Aventuriers", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-aventure.jpg" },
  { value: "fantasy", label: "Fantasy", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-fantasy.jpg" },
  { value: "science_fiction", label: "Science-Fiction", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-sciencefiction.jpg" },
  { value: "super_heros", label: "Super-Héros", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-superhero.jpg" },
  { value: "histoire_coeur", label: "Histoire de Cœur", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-amour.jpg", minAge: 12 },
  { value: "frayeurs_mysterieuses", label: "Frayeurs Mystérieuses", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-scary.jpg", minAge: 12 },
  { value: "enquete", label: "Enquête", image: "https://fabluo.com/wp-content/uploads/2025/03/1-storystyle-investigation.jpg", minAge: 12 }
] as const;

export const THEMES = [
  "Scolarité", "Famille", "Émotions", "Relations", 
  "Autonomie", "Numérique", "Autre", "seulement du divertissement"
] as const;

export const THEME_PROBLEMS: Record<string, string[]> = {
  "Scolarité": [
    "Difficultés d'apprentissage",
    "Harcèlement scolaire",
    "Anxiété des examens",
    "Problèmes de concentration",
    "Relations avec les enseignants"
  ],
  "Famille": [
    "Divorce des parents",
    "Arrivée d'un nouveau membre",
    "Conflits familiaux",
    "Déménagement",
    "Perte d'un proche"
  ],
  "Émotions": [
    "Gestion de la colère",
    "Anxiété",
    "Tristesse",
    "Peur du noir",
    "Manque de confiance en soi"
  ],
  "Relations": [
    "Difficultés à se faire des amis",
    "Conflits avec les pairs",
    "Timidité excessive",
    "Problèmes de communication",
    "Jalousie"
  ],
  "Autonomie": [
    "Peur de grandir",
    "Difficultés à prendre des décisions",
    "Dépendance excessive",
    "Manque d'initiative",
    "Peur de l'échec"
  ],
  "Numérique": [
    "Addiction aux écrans",
    "Cyberharcèlement",
    "Exposition à du contenu inapproprié",
    "Isolement social",
    "Problèmes de sommeil liés aux écrans"
  ]
};
