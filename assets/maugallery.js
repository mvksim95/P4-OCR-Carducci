(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },

    prevImage() {
      console.log("prev cliqué");
      let activeImage = null;
    
      // Trouver l'image active dans la lightbox
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this); // Stocke l'image actuellement affichée dans activeImage
        }
      });
    
      console.log("active image: ", activeImage);
    
      let imagesCollection = [];
    
      //récupère la catégorie active pour ne prendre que les images de cette catégorie
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
    
      // Si la catégorie active est "all", on prend toutes les images, sinon, on ne prend que les images de la catégorie sélectionnée
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img").get(0)); //Utilisation d'éléments DOM purs
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img").get(0)); //ajout des images filtrées uniquement par catégorie active
          }
        });
      }
    
      console.log("Images collection: ", imagesCollection);
    
      // Trouver l'index de l'image active
      let index = 0;
      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
    
      console.log("Current index: ", index);
    
      // Calculer l'index de l'image précédente
      let prevIndex = index - 1;
      if (prevIndex < 0) {
        prevIndex = imagesCollection.length - 1; // Revient à la dernière image si on est sur la première
      }
    
      // Mettre à jour l'image affichée dans la lightbox
      let nextImage = imagesCollection[prevIndex];
      $(".lightboxImage").attr("src", $(nextImage).attr("src")); // Change la source de l'image dans la lightbox
    }
    ,

    nextImage() {
      console.log("next cliqué");
      let activeImage = null;
    
      // Trouver l'image active dans la lightbox
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this); // Stocke l'image actuellement affichée dans activeImage
        }
      });
    
      console.log("active image: ", activeImage);
    
      let imagesCollection = [];
    
      //récupère la catégorie active pour ne prendre que les images de cette catégorie
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
    
      // Si la catégorie active est "all", on prend toutes les images, sinon, on ne prend que les images de la catégorie sélectionnée
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img").get(0)); //utilisation d'éléments DOM purs
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img").get(0)); //ajout des images filtrées uniquement par catégorie active
          }
        });
      }
    
      console.log("Images collection: ", imagesCollection);
    
      // Trouver l'index de l'image active
      let index = 0;
      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
    
      console.log("Current index: ", index);
    
      // Calculer l'index de l'image suivante
      let nextIndex = index + 1;
      if (nextIndex >= imagesCollection.length) {
        nextIndex = 0; // Revient à la première image si on est sur la dernière
      }
    
      // Mettre à jour l'image affichée dans la lightbox
      let nextImage = imagesCollection[nextIndex];
      $(".lightboxImage").attr("src", $(nextImage).attr("src")); // Change la source de l'image dans la lightbox
    },

    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${lightboxId ? lightboxId : "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    showItemTags(gallery, position, tags) {
      var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return; // Si ce bouton est déjà actif, ne fais rien
      }
    
      // Supprime les classes "active" et "active-tag" du bouton actif actuel
      $(".active-tag").removeClass("active active-tag");
    
      // Ajoute les classes "active" et "active-tag" au bouton cliqué
      $(this).addClass("active active-tag");
    
      // Gestion des images en fonction du tag
      var tag = $(this).data("images-toggle");
    
      $(".gallery-item").each(function() {
        $(this).parents(".item-column").hide(); // Cache toutes les images
    
        if (tag === "all") {
          $(this).parents(".item-column").show(300); // Affiche toutes les images si le tag est "all"
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300); // Affiche uniquement les images correspondant au tag
        }
      });
    }
  };
})(jQuery);
