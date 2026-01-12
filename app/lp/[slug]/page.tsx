'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TemplateSaaS from '@/components/landing-templates/template-saas';
import TemplateProdutos from '@/components/landing-templates/template-produtos';
import TemplateServicos from '@/components/landing-templates/template-servicos';

interface LandingPageData {
  id: string;
  name: string;
  slug: string;
  template: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  ctaText: string;
  ctaUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  features?: Array<{ title: string; description: string; icon?: string }>;
  testimonials?: Array<{ name: string; role: string; text: string; photo?: string }>;
  formId?: string;
  form?: any;
}

export default function PublicLandingPage() {
  const params = useParams();
  const [data, setData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchLandingPage();
    }
  }, [params.slug]);

  const fetchLandingPage = async () => {
    try {
      const response = await fetch(`/api/landing-pages/slug/${params.slug}`);
      if (response.ok) {
        const landingPage = await response.json();
        setData(landingPage);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Erro ao carregar landing page:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCtaClick = () => {
    if (data?.ctaUrl) {
      window.location.href = data.ctaUrl;
    } else if (data?.formId) {
      // Scroll to form or open modal
      const formElement = document.getElementById('landing-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Página Não Encontrada</h1>
          <p className="text-gray-600 mb-8">
            A landing page que você está procurando não existe ou foi removida.
          </p>
          <a
            href="/"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    );
  }

  const templateProps = {
    data: {
      title: data.title,
      subtitle: data.subtitle,
      heroImage: data.heroImage,
      ctaText: data.ctaText,
      ctaUrl: data.ctaUrl,
      features: data.features,
      testimonials: data.testimonials,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
    },
    onCtaClick: handleCtaClick,
  };

  let TemplateComponent;
  switch (data.template) {
    case 'saas':
      TemplateComponent = TemplateSaaS;
      break;
    case 'produtos':
      TemplateComponent = TemplateProdutos;
      break;
    case 'servicos':
      TemplateComponent = TemplateServicos;
      break;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div>Template não encontrado</div>
        </div>
      );
  }

  return (
    <div>
      <TemplateComponent {...templateProps} />
    </div>
  );
}