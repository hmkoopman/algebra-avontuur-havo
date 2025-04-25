
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExplanationSectionProps {
  title: string;
  children: React.ReactNode;
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border border-border rounded-lg overflow-hidden">
      <button
        className="w-full p-4 text-left font-medium flex justify-between items-center bg-secondary/30"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isExpanded && (
        <div className="p-4 bg-background">
          {children}
        </div>
      )}
    </div>
  );
};

const EquationExplanation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        {isVisible ? 'Verberg Uitleg' : 'Toon Uitleg'}
      </button>

      {isVisible && (
        <div className="bg-card p-4 rounded-lg shadow-md">
          <ExplanationSection title="Lineaire Vergelijkingen - De Balansmethode">
            <p className="mb-2">Een lineaire vergelijking heeft de vorm: ax + b = c</p>
            <p className="mb-2">Bij het oplossen gebruiken we de balansmethode:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Haal alle termen met x naar één kant van het = teken.</li>
              <li>Haal alle getallen naar de andere kant.</li>
              <li>Deel beide kanten door de coëfficiënt van x.</li>
            </ol>
            <div className="mt-3 p-3 bg-secondary/50 rounded-md">
              <p className="mb-2"><b>Voorbeeld:</b> 3x + 5 = 17</p>
              <p>3x + 5 - 5 = 17 - 5 <span className="text-muted-foreground">(trek 5 af van beide kanten)</span></p>
              <p>3x = 12 <span className="text-muted-foreground">(vereenvoudig)</span></p>
              <p>3x ÷ 3 = 12 ÷ 3 <span className="text-muted-foreground">(deel beide kanten door 3)</span></p>
              <p>x = 4 <span className="text-muted-foreground">(oplossing)</span></p>
            </div>
          </ExplanationSection>

          <ExplanationSection title="Kwadratische Vergelijkingen - Vorm x² = c">
            <p className="mb-2">Dit is de eenvoudigste vorm van een kwadratische vergelijking. Je moet de wortel nemen.</p>
            <p className="mb-2">De algemene vorm is: x² = c</p>
            <p className="mb-2">De oplossing is: x = √c of x = -√c</p>
            <div className="mt-3 p-3 bg-secondary/50 rounded-md">
              <p className="mb-2"><b>Voorbeeld:</b> x² = 16</p>
              <p>x = √16 = 4 of x = -√16 = -4</p>
              <p className="mt-2">De oplossingen zijn dus x = 4 of x = -4</p>
            </div>
          </ExplanationSection>

          <ExplanationSection title="Kwadratische Tweeterm - Vorm ax² + bx = 0">
            <p className="mb-2">Bij een kwadratische tweeterm kunnen we x buiten haakjes halen.</p>
            <p className="mb-2">Voor ax² + bx = 0:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Haal x buiten haakjes: x(ax + b) = 0</li>
              <li>Een product is 0 als één van de factoren 0 is, dus:</li>
              <li>x = 0 of ax + b = 0</li>
              <li>Los de tweede vergelijking op: x = -b/a</li>
            </ol>
            <div className="mt-3 p-3 bg-secondary/50 rounded-md">
              <p className="mb-2"><b>Voorbeeld:</b> 2x² - 8x = 0</p>
              <p>2x(x - 4) = 0</p>
              <p className="mt-2">Dus x = 0 of x - 4 = 0</p>
              <p>Dat geeft x = 0 of x = 4</p>
            </div>
          </ExplanationSection>

          <ExplanationSection title="Kwadratische Drieterm - Ontbinden in Factoren">
            <p className="mb-2">Een kwadratische vergelijking in de vorm ax² + bx + c = 0 kunnen we oplossen met de productsommethode.</p>
            <p className="mb-2">We zoeken naar getallen p en q zodat:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>p × q = a × c</li>
              <li>p + q = b</li>
            </ul>
            <p className="my-2">Stappen:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Vermenigvuldig a en c.</li>
              <li>Zoek twee getallen die a×c als product hebben en b als som.</li>
              <li>Herschrijf de middelste term bx als px + qx.</li>
              <li>Groepeer de termen en ontbind in factoren.</li>
            </ol>
            <div className="mt-3 p-3 bg-secondary/50 rounded-md">
              <p className="mb-2"><b>Voorbeeld:</b> x² + 5x + 6 = 0</p>
              <p>We zoeken getallen p en q zodat p×q = 1×6 = 6 en p+q = 5</p>
              <p>Deze getallen zijn 2 en 3, want 2×3 = 6 en 2+3 = 5</p>
              <p>x² + 5x + 6 = x² + 2x + 3x + 6 = (x² + 2x) + (3x + 6) = x(x + 2) + 3(x + 2) = (x + 2)(x + 3)</p>
              <p className="mt-2">Dus x + 2 = 0 of x + 3 = 0</p>
              <p>De oplossingen zijn x = -2 of x = -3</p>
            </div>
          </ExplanationSection>
        </div>
      )}
    </div>
  );
};

export default EquationExplanation;
